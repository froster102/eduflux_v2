import { inject } from 'inversify';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import { PaymentType } from '@payment/entity/enum/PaymentType';
import { StripeService } from '@payment/service/StripeService';
import { PaymentFactory } from '@payment/factory/PaymentFactory';
import { PrepareCheckout } from '@payment/service/PrepareCheckout';
import type { CreateStripeCheckoutPayload } from '@payment/service/types/CreateStripeCheckoutPayload';
import type { GetPaymentsPayload } from '@payment/service/types/GetPaymentsPayload';
import type { GetPaymentSummaryPayload } from '@payment/service/types/GetPaymentSummaryParams';
import { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
} from '@eduflux-v2/shared/adapters/grpc/generated/payment';

export class PaymentService {
  constructor(
    @inject(PaymentDITokens.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(PaymentDITokens.StripeService)
    private readonly stripeService: StripeService,
  ) {}

  async createPayment(
    request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const {
      userId,
      totalAmount,
      instructorId,
      platformFee,
      currency,
      type,
      referenceId,
      successUrl,
      cancelUrl,
      item,
    } = request;

    if (!userId || !totalAmount || !instructorId || !referenceId) {
      throw new BadRequestException('Missing required payment fields');
    }

    const paymentType =
      type === 'course'
        ? PaymentType.COURSE_PURCHASE
        : PaymentType.SESSION_BOOKING;

    // Check for existing payment (idempotency)
    const idempotencyKey = `${paymentType}_${referenceId}_${userId}_${Date.now()}`;

    const existingPayment = await this.paymentRepository.findExistingPayment({
      userId,
      referenceId,
      paymentType,
      validStatuses: [PaymentStatus.PENDING, PaymentStatus.COMPLETED],
    });

    if (existingPayment) {
      if (existingPayment.status === PaymentStatus.COMPLETED) {
        throw new BadRequestException(
          'Payment already completed for this item',
        );
      }

      // If existing payment has an active Stripe session, return it
      if (existingPayment.gatewayTransactionId) {
        try {
          const stripeSession =
            await this.stripeService.retrieveCheckoutSession(
              existingPayment.gatewayTransactionId,
            );
          if (
            stripeSession.status === 'open' &&
            stripeSession.expires_at > Math.floor(Date.now() / 1000)
          ) {
            return {
              checkoutUrl: stripeSession.url as string,
            };
          }
        } catch {
          // Session expired or invalid, create new one
        }
      }
    }

    // Create new payment entity
    // Use provided platformFee and instructorRevenue, but calculate rate for factory
    const calculatedPlatformFeeRate =
      totalAmount > 0 ? platformFee / totalAmount : 0.3;

    const payment = PaymentFactory.create({
      userId,
      instructorId,
      amount: totalAmount,
      paymentType,
      referenceId,
      idempotencyKey,
      currency,
      platformFeeRate: calculatedPlatformFeeRate,
    });

    // Prepare Stripe checkout payload
    const itemTitle = item?.title ?? 'Payment';
    const stripePayload: CreateStripeCheckoutPayload =
      PrepareCheckout.fromRequest(
        payment,
        {
          title: itemTitle,
          amount: totalAmount,
        },
        {
          successUrl,
          cancelUrl,
        },
      );

    await this.paymentRepository.save(payment);

    try {
      const checkoutSession =
        await this.stripeService.createCheckoutSession(stripePayload);
      payment.setTransactionId(checkoutSession.id);
      await this.paymentRepository.update(payment.id, payment);

      return {
        checkoutUrl: checkoutSession.url as string,
      };
    } catch (e) {
      await this.paymentRepository.delete(payment.id);
      throw e;
    }
  }

  async getPayments(payload: GetPaymentsPayload) {
    const { executor, query } = payload;

    if (executor.hasRole(Role.ADMIN)) {
      return this.paymentRepository.findMany(query);
    }

    if (executor.hasRole(Role.INSTRUCTOR)) {
      if (!query?.filter?.instructorId) {
        throw new ForbiddenException('You are not authorized for this action');
      }

      if (query.filter.instructorId !== executor.id) {
        throw new ForbiddenException('You are not authorized for this action');
      }

      return this.paymentRepository.findMany(query);
    }

    throw new ForbiddenException('You are not authorized for this action');
  }

  async getPaymentsWithSummary(payload: GetPaymentSummaryPayload) {
    const { user, filter } = payload;

    if (!user.hasRole(Role.ADMIN) && !user.hasRole(Role.INSTRUCTOR)) {
      throw new ForbiddenException(
        'You are not authorized to perform this action.',
      );
    }

    if (user.hasRole(Role.INSTRUCTOR) && filter) {
      filter.instructorId = user.id;
    }

    const summary = await this.paymentRepository.aggregatePaymentSummary(
      filter?.groupBy ?? PaymentSummaryGroup.MONTH,
      filter,
      filter?.startDate,
      filter?.endDate,
    );

    const totalInstructorRevenue = summary.reduce(
      (sum, s) => sum + s.instructorRevenue,
      0,
    );
    const totalPlatformRevenue = summary.reduce(
      (sum, s) => sum + s.platformFee,
      0,
    );

    return {
      totalInstructorRevenue,
      totalPlatformRevenue,
      summary,
    };
  }

  async getInstructorTotalEarnings(
    instructorId: string,
  ): Promise<{ earnings: number }> {
    const result =
      await this.paymentRepository.getInstructorEarning(instructorId);
    return result;
  }
}

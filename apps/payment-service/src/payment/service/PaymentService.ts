import { inject } from 'inversify';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import { PaymentType } from '@payment/entity/enum/PaymentType';
import { StripeService } from '@payment/service/StripeService';
import { Payment } from '@payment/entity/Payment';
import { PaymentFactory } from '@payment/factory/PaymentFactory';
import { PrepareCheckout } from '@payment/service/PrepareCheckout';
import type { GetPaymentsPayload } from '@payment/service/types/GetPaymentsPayload';
import type { GetPaymentSummaryPayload } from '@payment/service/types/GetPaymentSummaryParams';
import { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';
import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import type { SessionServicePort } from '@eduflux-v2/shared/ports/gateway/SessionServicePort';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import type { Course } from '@eduflux-v2/shared/types/course';
import type { Session } from '@eduflux-v2/shared/ports/gateway/SessionServicePort';
import type { Enrollment } from '@eduflux-v2/shared/types/enrollment';

export class PaymentService {
  private readonly platformFeeRate = 0.3;
  constructor(
    @inject(PaymentDITokens.CourseService)
    private readonly courseService: CourseServicePort,
    @inject(PaymentDITokens.SessionService)
    private readonly sessionService: SessionServicePort,
    @inject(PaymentDITokens.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(PaymentDITokens.StripeService)
    private readonly stripeService: StripeService,
  ) {}

  async handleCheckout(
    type: 'course' | 'session',
    referenceId: string,
    userId: string,
  ) {
    const paymentType =
      type === 'course'
        ? PaymentType.COURSE_PURCHASE
        : PaymentType.SESSION_BOOKING;
    const idempotencyKey = `${paymentType}_${referenceId}_${userId}_${crypto.randomUUID()}`;

    const existingPayment = await this.paymentRepository.findExistingPayment({
      userId,
      referenceId,
      paymentType,
      validStatuses: [PaymentStatus.PENDING, PaymentStatus.COMPLETED],
    });

    if (existingPayment) {
      return this.handleExisting(existingPayment, idempotencyKey);
    }

    return this.createNew(paymentType, referenceId, userId, idempotencyKey);
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

    const queryFilter: Record<string, any> = {};

    if (user.hasRole(Role.INSTRUCTOR)) {
      queryFilter.instructorId = user.id;
    } else if (filter?.instructorId) {
      queryFilter.instructorId = filter.instructorId;
    }

    const summary = await this.paymentRepository.aggregatePaymentSummary(
      filter?.groupBy ?? PaymentSummaryGroup.MONTH,
      queryFilter,
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

  private async handleExisting(
    existingPayment: Payment,
    newIdempotencyKey: string,
  ) {
    if (existingPayment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed for this item');
    }

    if (existingPayment.gatewayTransactionId) {
      try {
        const sessionId = existingPayment.gatewayTransactionId;
        const stripeSession =
          await this.stripeService.retrieveCheckoutSession(sessionId);
        if (
          stripeSession.status === 'open' &&
          stripeSession.expires_at > Math.floor(Date.now() / 1000)
        ) {
          return {
            checkoutSessionId: stripeSession.id,
            clientSecret: stripeSession.client_secret || '',
            checkoutUrl: stripeSession.url!,
          };
        }
      } catch (e) {
        console.warn(`Session retrieval failed: ${(e as Error).message}`);
      }
    }

    return this.createNew(
      existingPayment.type,
      existingPayment.referenceId,
      existingPayment.userId,
      newIdempotencyKey,
    );
  }

  private async createNew(
    paymentType: PaymentType,
    referenceId: string,
    userId: string,
    idempotencyKey: string,
  ) {
    let amount: number = 0;
    let instructorId: string = '';
    let course: Course | null = null;

    if (paymentType === PaymentType.COURSE_PURCHASE) {
      const enrollment = await this.courseService.getEnrollment(referenceId);
      course = await this.courseService.getCourse(enrollment.courseId);
      amount = course.price || 0;
      instructorId = course.instructor.id;
    } else {
      const session = await this.sessionService.getSession(referenceId);
      amount = session.price;
      instructorId = session.instructorId;
    }

    const payment = PaymentFactory.create({
      userId,
      instructorId,
      amount,
      paymentType,
      referenceId,
      idempotencyKey,
      platformFeeRate: this.platformFeeRate,
    });

    const stripePayload =
      paymentType === PaymentType.COURSE_PURCHASE && course
        ? PrepareCheckout.forCourse(payment, course)
        : PrepareCheckout.forSession(
            payment,
            await this.sessionService.getSession(referenceId),
          );

    await this.paymentRepository.save(payment);

    try {
      const checkoutSession =
        await this.stripeService.createCheckoutSession(stripePayload);
      payment.setTransactionId(checkoutSession.id);
      await this.paymentRepository.update(payment.id, payment);

      return {
        checkoutSessionId: checkoutSession.id,
        clientSecret: checkoutSession.client_secret!,
        checkoutUrl: checkoutSession.url!,
      };
    } catch (e) {
      await this.paymentRepository.delete(payment.id);
      throw e;
    }
  }
}

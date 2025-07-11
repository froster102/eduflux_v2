import type { IPaymentRepository } from '@/domain/repositories/transaction.repository';
import type {
  IStripeGateway,
  StripeWebhookEvent,
} from '../ports/stripe.gateway';
import type {
  IMessageBrokerGatway,
  IPaymentEvent,
} from '../ports/message-broker.gateway';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { ApplicationException } from '../exception/application.exception';
import { AppErrorCode } from '@/shared/error/error-code';
import { v4 as uuidV4 } from 'uuid';
import { Logger } from '@/shared/utils/logger';
import { PAYMENT_SERVICE } from '@/shared/constants/service';

import { tryCatch } from '@/shared/utils/try-catch';
import { PAYMENTS_TOPIC } from '@/shared/constants/topics';

interface HandleStripeWebhookInput {
  rawBody: string | Buffer;
  signature: string;
}

interface HandleStripeWebhookOutput {
  success: boolean;
  message: string;
}

export class HandleStripeWebhookUseCase
  implements IUseCase<HandleStripeWebhookInput, HandleStripeWebhookOutput>
{
  private logger = new Logger(PAYMENT_SERVICE);
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.StripeGateway) private readonly stipeGateway: IStripeGateway,
    @inject(TYPES.MessageBrokerGateway)
    private readonly messageBrokerGateway: IMessageBrokerGatway,
  ) {}

  async execute(
    input: HandleStripeWebhookInput,
  ): Promise<HandleStripeWebhookOutput> {
    const { data, error } = await tryCatch(
      this.stipeGateway.constructEventFromWebhook(
        input.rawBody,
        input.signature,
      ),
    );

    if (error) {
      throw new ApplicationException(
        `Webhook error: ${(error as Record<string, any>).message}`,
        AppErrorCode.INTERNAL,
      );
    }

    const event: StripeWebhookEvent = data;

    const internalPaymentId =
      ((event.data.object as Record<string, any>)
        .client_reference_id as string) ||
      (event.data.object.metadata.paymentId as string);
    const correlationId = uuidV4();

    if (!internalPaymentId) {
      this.logger.warn(
        `Stripe event ${event.id} received without internal payment ID (correlationId: ${correlationId})`,
      );
      return {
        success: true,
        message: 'Missing internal payment ID in webhook.',
      };
    }

    const payment = await this.paymentRepository.findById(internalPaymentId);

    if (!payment) {
      this.logger.warn(
        `Payment record with ID ${internalPaymentId} not found.`,
      );
      return {
        success: true,
        message: 'Payment in with internal payment ID not found.',
      };
    }

    let eventToPublish: IPaymentEvent | null = null;
    let updatePayment: boolean = false;

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const paymentIntentId = (event.data.object as Record<string, any>)
            .payment_intent as string;
          if (payment.status !== 'SUCCESS' && payment.status !== 'REFUNDED') {
            payment.markAsSuccess(paymentIntentId);
            updatePayment = true;
            eventToPublish = {
              type: 'payment.success',
              correlationId: correlationId,
              data: {
                paymentId: payment.id,
                amount: payment.amount,
                currency: payment.currency,
                metadata: payment.metadata,
                occurredAt: new Date(event.created * 1000).toISOString(),
                providerPaymentId: paymentIntentId,
                paymentProvider: 'STRIPE',
                payerId: payment.payerId,
                paymentPurpose: payment.paymentPurpose,
              },
            };
          }
          break;
        }
        case 'payment_intent.payment_failed':
        case 'checkout.session.async_payment_failed': {
          if (payment.status === 'PENDING') {
            const failureReason =
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ((event.data.object as any).last_payment_error
                ?.message as string) || (event.type as string);

            payment.markAsFailed(failureReason);
            updatePayment = true;
            eventToPublish = {
              type: 'payment.failed',
              correlationId,
              data: {
                paymentId: payment.id,
                providerPaymentId: event.data.object.id,
                paymentProvider: 'STRIPE',
                payerId: payment.payerId,
                paymentPurpose: payment.paymentPurpose,
                amount: payment.amount,
                currency: payment.currency,
                metadata: payment.metadata,
                occurredAt: new Date(Date.now() * 1000).toISOString(),
              },
            };
          }
          break;
        }
        case 'payment_intent.canceled':
        case 'checkout.session.expired':
          if (payment.status === 'SUCCESS') {
            payment.markAsCanceled();
            updatePayment = true;
            eventToPublish = {
              type: 'payment.cancelled',
              correlationId,
              data: {
                paymentId: payment.id,
                providerPaymentId: event.data.object.id,
                paymentProvider: 'STRIPE',
                payerId: payment.payerId,
                paymentPurpose: payment.paymentPurpose,
                amount: payment.amount,
                currency: payment.currency,
                reason: `Stripe ${event.type} event`,
                metadata: payment.metadata,
                occurredAt: new Date(event.created * 1000).toISOString(),
              },
            };
          }
          break;

        default: {
          this.logger.warn(
            `Unhandled Stripe event type: ${event.type} (correlationId: ${correlationId}). Event acknowledged.`,
          );
          return {
            success: true,
            message: `Unhandled event type ${event.type}. Event acknowledged.`,
          };
        }
      }

      if (updatePayment) {
        await this.paymentRepository.update(payment.id, payment);
      }

      if (eventToPublish) {
        await this.messageBrokerGateway.publish(PAYMENTS_TOPIC, eventToPublish);
      }

      return { success: true, message: 'Webhook processed successfully.' };
    } catch (error: any) {
      this.logger.error(
        `Error processing Stripe event ${event.id} for payment ${payment.id} (correlationId: ${correlationId}):`,
      );
      throw new ApplicationException(
        `Failed to process webhook for internal reasons: ${(error as Record<string, any>).message as string}`,
        AppErrorCode.INTERNAL,
      );
    }
  }
}

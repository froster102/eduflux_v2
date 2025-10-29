import Stripe from 'stripe';
import { StripeConfig } from '@shared/config/StripeConfig';
import type { CreateStripeCheckoutPayload } from '@payment/service/types/CreateStripeCheckoutPayload';
import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import { inject } from 'inversify';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import { StripeWebhookException } from '@payment/exceptions/StripeWebhookException';
import type { PaymentSuccessMetadata } from '@payment/service/types/PaymentSuccessMetadata';
import { producer } from '@infrastructure/kafka/setup';
import { PaymentType } from '@payment/entity/enum/PaymentType';
import { ENROLLMENT_TOPIC, SESSION_TOPIC } from '@shared/constants/topics';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import type { EnrollmentPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/course/EnrollmentPaymentSuccessfullEvent';
import { CourseEvents } from '@eduflux-v2/shared/events/course/enum/CourseEvents';
import type { SessionPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/session/SessionPaymentSuccessfullEvent';
import { SessionEvents } from '@eduflux-v2/shared/events/session/enum/SessionEvents';
import type { Event } from '@eduflux-v2/shared/events/Event';
import { EnrollmentEvents } from '@eduflux-v2/shared/events/course/enum/EnrollmentEvents';

export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    @inject(PaymentDITokens.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
  ) {
    this.stripe = new Stripe(StripeConfig.STRIPE_API_SECRET, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    });
  }

  async createCheckoutSession(
    payload: CreateStripeCheckoutPayload,
  ): Promise<Stripe.Checkout.Session> {
    const { item, metadata, successUrl, cancelUrl, idempotencyKey } = payload;
    try {
      return await this.stripe.checkout.sessions.create(
        {
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: 'USD',
                product_data: {
                  name: item.name,
                  description: item.description,
                  images: item.images,
                },
                unit_amount: item.amount,
              },
            },
          ],
          mode: 'payment',
          success_url: successUrl,
          cancel_url: cancelUrl,
          payment_intent_data: {
            metadata,
          },
        },
        { idempotencyKey },
      );
    } catch (error) {
      throw new BadRequestException(
        `Stripe checkout failed: ${(error as Error).message}`,
      );
    }
  }

  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
  }

  async handleWebhook(
    rawBuffer: Buffer<ArrayBuffer>,
    signature: string,
  ): Promise<void> {
    const { data: event, error } = await tryCatch(
      this.stripe.webhooks.constructEventAsync(
        rawBuffer,
        signature,
        StripeConfig.STRIPE_WEBHOOK_SECRET,
      ),
    );
    if (error) {
      throw new StripeWebhookException(error.message);
    }
    const { type, data } = event;
    if (
      !['payment_intent.succeeded', 'payment_intent.payment_failed'].includes(
        type,
      )
    ) {
      return;
    }
    const metadata = (data.object as Record<string, any>)
      ?.metadata as PaymentSuccessMetadata;

    const payment = await this.paymentRepository.findById(metadata.payment_id);
    if (!payment || payment.status === PaymentStatus.COMPLETED) {
      return;
    }

    if (type === 'payment_intent.succeeded') {
      if (payment.type === PaymentType.COURSE_PURCHASE) {
        const enrollmentPaymentSuccessfullEvent: EnrollmentPaymentSuccessfullEvent =
          {
            id: payment.id,
            type: EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESSFULL,
            paymentType: payment.type,
            paymentId: payment.id,
            enrollmentId: payment.referenceId,
            instructorId: payment.instructorId,
            totalAmount: payment.totalAmount,
            platformFee: payment.platformFee,
            instructorRevenue: payment.instructorRevenue,
            currency: 'USD',
            timestamp: new Date().toISOString(),
          };
        await producer.send({
          topic: ENROLLMENT_TOPIC,
          messages: [
            {
              key: enrollmentPaymentSuccessfullEvent.id,
              value: JSON.stringify(enrollmentPaymentSuccessfullEvent),
              headers: {
                //attach correlation id from async store
                'x-correlation-id': '',
              },
            },
          ],
        });
      } else if (payment.type === PaymentType.SESSION_BOOKING) {
        const sessionPaymentSuccessfullEvent: SessionPaymentSuccessfullEvent = {
          id: payment.referenceId,
          type: SessionEvents.SESSION_PAYMENT_SUCCESSFULL,
          paymentType: PaymentType.SESSION_BOOKING,
          paymentId: payment.id,
          sessionId: payment.referenceId,
          instructorId: payment.instructorId,
          totalAmount: payment.totalAmount,
          platformFee: payment.platformFee,
          instructorRevenue: payment.instructorRevenue,
          currency: 'USD',
          timestamp: new Date().toISOString(),
        };
        await producer.send({
          topic: SESSION_TOPIC,
          messages: [
            {
              key: sessionPaymentSuccessfullEvent.id,
              value: JSON.stringify(sessionPaymentSuccessfullEvent),
              headers: {
                //attach correlation id from async store
                'x-correlation-id': '',
              },
            },
          ],
        });
      }
      payment.status = PaymentStatus.COMPLETED;
      payment.updatedAt = new Date();
      await this.paymentRepository.update(payment.id, payment);
    }
  }
}

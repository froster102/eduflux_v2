import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import { inject } from 'inversify';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka } from '@/infrastructure/messaging/kafka/setup';
import { tryCatch } from '@/shared/utils/try-catch';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { PaymentPurpose } from '@/application/ports/payment-service.gateway';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { PAYMENTS_TOPIC } from '@/shared/constants/topics';
import { SESSION_SERVICE_CONSUMER_GROUP } from '@/shared/constants/consumer';
import { ConfirmSessionBookingInput } from '@/application/use-cases/confirm-session-booking.use-case';

export interface IPaymentEvent {
  type: 'payment.failed' | 'payment.success' | 'payment.cancelled';
  correlationId: string;
  data: {
    paymentId: string;
    providerPaymentId: string | null;
    paymentProvider: 'STRIPE';
    payerId: string;
    paymentPurpose: PaymentPurpose;
    amount: number;
    currency: string;
    reason?: string;
    metadata: Record<string, any>;
    occurredAt: string;
  };
}

export class PaymentEventsConsumer {
  private consumer: Consumer;
  private logger = new Logger(SESSION_SERVICE);
  private topic: string;

  constructor(
    @inject(TYPES.ConfirmSessionBookingUseCase)
    private readonly confirmSessionBookingUseCase: IUseCase<
      ConfirmSessionBookingInput,
      void
    >,
  ) {
    this.topic = PAYMENTS_TOPIC;
    this.consumer = kafka.consumer({
      groupId: SESSION_SERVICE_CONSUMER_GROUP,
    });
  }

  async connect() {
    try {
      await this.consumer.connect();
      this.logger.info('Connected to kafka consumer');
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
      this.logger.info(`Kafka consumer subscribed to topic ${this.topic}`);

      await this.consumer.run({
        eachMessage: async ({
          topic,
          message,
          partition,
        }: EachMessagePayload) => {
          if (!message.value) {
            this.logger.warn(
              `Recieved null message value from ${topic}, partition ${partition}`,
            );
            return;
          }
          try {
            const event = JSON.parse(message.value.toString()) as IPaymentEvent;
            this.logger.info(
              `Recieved message: ${JSON.stringify(event)} from ${topic}`,
            );
            await this.handleEvent(event);
          } catch (error) {
            this.logger.error(
              `Error processing Kafka message from topic ${topic}, partition ${partition}: ${(error as Record<string, string>).message}`,
              error as Record<string, string>,
            );
          }
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to connect to kafka consumer: ${(error as Record<string, string>).message} `,
        error as Record<string, string>,
      );
      process.exit(1);
    }
  }

  async disconnect() {
    const { error } = await tryCatch(this.consumer.disconnect());

    if (error) {
      this.logger.error(`Failed to disconnect kafka consumer ${error.message}`);
    }
  }

  private async handleEvent(event: IPaymentEvent) {
    try {
      switch (event.type) {
        case 'payment.success':
          await this.confirmSessionBookingUseCase.execute({
            sessionId: event.data.metadata.sessionId as string,
            paymentId: event.data.paymentId,
          });
      }
    } catch (error) {
      if (
        error instanceof ApplicationException ||
        error instanceof DomainException ||
        error instanceof Error
      ) {
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

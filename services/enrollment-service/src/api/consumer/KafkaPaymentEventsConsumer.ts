import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CompleteEnrollmentUseCase } from '@core/application/enrollment/usecase/CompleteEnrollmentUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Exception } from '@core/common/exception/Exception';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ENROLLMENT_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { PAYMENTS_TOPIC } from '@shared/constants/topics';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';

export enum PaymentEvents {
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_CANCELLED = 'payment.cancelled',
}

export interface PaymentEvent {
  type: PaymentEvents;
  correlationId: string;
  paymentId: string;
  providerPaymentId: string | null;
  paymentProvider: PaymentProvider;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  amount: number;
  currency: string;
  reason?: string;
  metadata: Record<string, any>;
  occurredAt: string;
}

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(
    @inject(InfrastructureDITokens.KafkaEventBusConnection)
    private readonly kafkaEventBusConnection: KafkaEventBusConnection,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(EnrollmentDITokens.CompleteEnrollmentUseCase)
    private readonly completeEnrollmentUseCase: CompleteEnrollmentUseCase,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.topic = PAYMENTS_TOPIC;
    this.consumer = this.kafkaEventBusConnection.getConsumer(
      ENROLLMENT_SERVICE_CONSUMER_GROUP,
    );
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
            const event = JSON.parse(message.value.toString()) as PaymentEvent;
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

  private async handleEvent(event: PaymentEvent) {
    try {
      switch (event.type) {
        case PaymentEvents.PAYMENT_SUCCESS:
          if (event.paymentPurpose === 'COURSE_ENROLLMENT') {
            await this.completeEnrollmentUseCase.execute({
              enrollmentId: event.metadata.enrollmentId as string,
              paymentId: event.paymentId,
            });
          }
      }
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import { PaymentPurpose } from '@core/application/session/port/gateway/PaymentServicePort';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import { inject } from 'inversify';
import { PAYMENTS_TOPIC } from '@shared/constants/topics';
import { SESSION_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { tryCatch } from '@shared/utils/try-catch';
import { Exception } from '@core/common/exception/Exception';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';

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

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(SessionDITokens.ConfirmSessionBookingUseCase)
    private readonly confirmSessionBookingUseCase: ConfirmSessionBookingUseCase,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.topic = PAYMENTS_TOPIC;
    this.consumer = this.kafkaConnection.getConsumer(
      SESSION_SERVICE_CONSUMER_GROUP,
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
          if (event.data.paymentPurpose === PaymentPurpose.INSTRUCTOR_SESSION) {
            await this.confirmSessionBookingUseCase.execute({
              sessionId: event.data.metadata.sessionId as string,
              paymentId: event.data.paymentId,
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

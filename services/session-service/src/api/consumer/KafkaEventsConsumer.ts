import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import { PaymentPurpose } from '@core/application/session/port/gateway/PaymentServicePort';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import { inject } from 'inversify';
import {
  PAYMENTS_TOPIC,
  SESSION_TOPIC,
  USERS_TOPIC,
} from '@shared/constants/topics';
import { SESSION_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { tryCatch } from '@shared/utils/try-catch';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { ConfirmSessionEventHandler } from '@core/application/views/user-session/handler/ConfirmSessionHandler';
import { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';
import type { KafkaEvent } from '@infrastructure/adapter/messaging/kafka/types/KafkaEvent';
import { PaymentEvents } from '@core/common/events/enum/PaymentEvents';
import type { UserSessionUpdatedEventHandler } from '@core/application/views/user-session/handler/UserSessionUpdatedEventHandler';
import { UserEvents } from '@core/application/views/user-session/events/enum/UserEvents';
import type { UserUpdatedEventHandler } from '@core/application/views/user-session/handler/UserUpdatedEventHandler';

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(SessionDITokens.ConfirmSessionBookingUseCase)
    private readonly confirmSessionBookingUseCase: ConfirmSessionBookingUseCase,
    @inject(UserSessionDITokens.ConfirmSessionEventHandler)
    private readonly confirmSessionEventHandler: ConfirmSessionEventHandler,
    @inject(UserSessionDITokens.UserSessionUpdatedEventHandler)
    private readonly userSessionUpdatedEventHandler: UserSessionUpdatedEventHandler,
    @inject(UserSessionDITokens.UserUpdatedEventHandler)
    private readonly userUpdatedEventHanlder: UserUpdatedEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.topics = [PAYMENTS_TOPIC, SESSION_TOPIC, USERS_TOPIC];
    this.consumer = this.kafkaConnection.getConsumer(
      SESSION_SERVICE_CONSUMER_GROUP,
    );
  }

  async run(): Promise<void> {
    try {
      await this.consumer.connect();
      this.logger.info('Connected to Kafka consumer');

      await this.consumer.subscribe({
        topics: this.topics,
        fromBeginning: true,
      });
      this.logger.info(
        `Kafka consumer subscribed to topics ${this.topics.join(',')}`,
      );

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
            const event: KafkaEvent = JSON.parse(
              message.value.toString(),
            ) as KafkaEvent;
            this.logger.info(
              `Recieved message: ${JSON.stringify(event)} from ${topic}`,
            );

            switch (event.type) {
              case SessionEvents.SESSION_CONFIRMED: {
                await this.confirmSessionEventHandler.handle(event);
                break;
              }
              case SessionEvents.SESSION_UPDATED: {
                await this.userSessionUpdatedEventHandler.handle(event);
                break;
              }
              case UserEvents.USER_UPDATED: {
                await this.userUpdatedEventHanlder.handle(event);
                break;
              }
              case PaymentEvents.PAYMENT_SUCCESS: {
                if (
                  event.paymentPurpose === PaymentPurpose.INSTRUCTOR_SESSION
                ) {
                  await this.confirmSessionBookingUseCase.execute({
                    sessionId: event.metadata.sessionId as string,
                    paymentId: event.paymentId,
                  });
                }
                break;
              }

              default:
                this.logger.warn(
                  `Unknown event type received: ${(event as Record<string, any>)?.type as string}`,
                );
            }
          } catch (error) {
            this.logger.error(
              `Error processing Kafka message from topic ${topic}, partition ${partition}: ${(error as Error)?.message}`,
              error as Record<string, string>,
            );
          }
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to connect to kafka consumer: ${(error as Error)?.message}`,
        error as Record<string, string>,
      );
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    const { error } = await tryCatch(this.consumer.disconnect());

    if (error) {
      this.logger.error(
        `Failed to disconnect Kafka consumer: ${error.message}`,
      );
    } else {
      this.logger.info('Kafka consumer disconnected gracefully.');
    }
  }
}

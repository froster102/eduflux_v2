import { ChatEvents } from '@core/application/chat/events/enum/ChatEvents';
import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserChatCreatedEventHandler } from '@core/application/views/user-chat/handler/UserChatCreateEventHandler';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { UserEvents } from '@core/application/views/user-chat/events/enum/UserEvents';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { KafkaConnection } from '@infrastructure/adapter/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { CHAT_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { CHAT_TOPIC, USERS_TOPIC } from '@shared/constants/topics';
import type { KafkaEvent } from '@shared/types/KafkaEvent';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import type { UserUpdatedEventHandler } from '@core/application/views/user-chat/handler/UserUpdatedEventHandler';

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;

  constructor(
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(UserChatDITokens.UserChatCreatedEventHandler)
    private readonly userChatCreatedEventHandler: UserChatCreatedEventHandler,
    @inject(UserChatDITokens.UserUpdatedEventHandler)
    private readonly userUpdatedEventHanlder: UserUpdatedEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.consumer = this.kafkaConnection.getConsumer(
      CHAT_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [CHAT_TOPIC, USERS_TOPIC];
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
              case ChatEvents.USER_CHAT_CREATED: {
                await this.userChatCreatedEventHandler.handle(event);
                break;
              }
              case UserEvents.USER_UPDATED: {
                await this.userUpdatedEventHanlder.handle(event);
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

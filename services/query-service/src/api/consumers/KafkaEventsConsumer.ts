import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { UserChatCreatedEventHandler } from "@core/application/user-chat/handler/UserChatCreateEventHandler";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { ConfirmSessionEventHandler } from "@core/application/user-session/handler/ConfirmSessionHandler";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import type { KafkaConnection } from "@infrastructure/adapter/kakfa/KafkaConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { QUERY_SERVICE_CONSUMER_GROUP } from "@shared/constants/consumer";
import { CHAT_TOPIC, SESSION_TOPIC } from "@shared/constants/topics";
import type { KafkaEvent } from "@shared/types/KafkaEvent";
import { tryCatch } from "@shared/utils/try-catch";
import { inject } from "inversify";
import type { Consumer, EachMessagePayload } from "kafkajs";

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;
  private readonly confirmSessionEventHandler: ConfirmSessionEventHandler;
  private readonly userChatCreatedEventHandler: UserChatCreatedEventHandler;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(UserSessionDITokens.ConfirmSessionEventHandler)
    confirmSessionEventHandler: ConfirmSessionEventHandler,
    @inject(UserChatDITokens.UserChatCreatedEventHandler)
    userChatCreatedEventHandler: UserChatCreatedEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.confirmSessionEventHandler = confirmSessionEventHandler;
    this.userChatCreatedEventHandler = userChatCreatedEventHandler;
    this.consumer = this.kafkaConnection.getConsumer(
      QUERY_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [SESSION_TOPIC, CHAT_TOPIC];
  }

  async run(): Promise<void> {
    try {
      await this.consumer.connect();
      this.logger.info("Connected to Kafka consumer");

      await this.consumer.subscribe({
        topics: this.topics,
        fromBeginning: true,
      });
      this.logger.info(
        `Kafka consumer subscribed to topics ${this.topics.join(",")}`,
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
              case "session.confirmed": {
                await this.confirmSessionEventHandler.handle(event);
                break;
              }
              case "user.chat.created": {
                await this.userChatCreatedEventHandler.handle(event);
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
      this.logger.info("Kafka consumer disconnected gracefully.");
    }
  }
}

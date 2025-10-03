import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import { InstructorViewEvents } from "@core/domain/instructor-view/enum/InstructorViewEvents";
import type { InstructorCreatedEventHandler } from "@core/application/instructor-view/handler/InstructorCreatedEventHandler";
import type { InstructorStatsEventHandler } from "@core/application/instructor-view/handler/InstructorStatsEventHandler";
import type { SessionSettingsEventHandler } from "@core/application/instructor-view/handler/SessionSettingsEventHandler";
import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { UserChatCreatedEventHandler } from "@core/application/user-chat/handler/UserChatCreateEventHandler";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { ConfirmSessionEventHandler } from "@core/application/user-session/handler/ConfirmSessionHandler";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { UserChatEvents } from "@core/domain/user-chat/events/enum/UserChatEvents";
import { UserSessionEvents } from "@core/domain/user-session/events/enum/UserSessionEvents";
import type { KafkaConnection } from "@infrastructure/adapter/kakfa/KafkaConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { QUERY_SERVICE_CONSUMER_GROUP } from "@shared/constants/consumer";
import {
  CHAT_TOPIC,
  INSTRUCTOR_TOPIC,
  SESSION_TOPIC,
  USERS_TOPIC,
} from "@shared/constants/topics";
import type { KafkaEvent } from "@shared/types/KafkaEvent";
import { tryCatch } from "@shared/utils/try-catch";
import { inject } from "inversify";
import type { Consumer, EachMessagePayload } from "kafkajs";
import { UserViewEvents } from "@core/application/user-view/events/enum/UserViewEvents";
import { UserViewDITokens } from "@core/application/user-view/di/UserViewDITokens";
import type { UserUpdatedEventHandler } from "@core/application/user-view/handler/UserUpdatedEventHandler";
import type { UserSessionUpdatedEventHandler } from "@core/application/user-session/handler/UserSessionUpdatedEventHandler";

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;
  private readonly confirmSessionEventHandler: ConfirmSessionEventHandler;
  private readonly userChatCreatedEventHandler: UserChatCreatedEventHandler;
  private readonly instructorStatsEventHandler: InstructorStatsEventHandler;
  private readonly sessionSettingsEventHandler: SessionSettingsEventHandler;
  private readonly instructorCreatedEventHandler: InstructorCreatedEventHandler;
  private readonly userUpdatedEventHandler: UserUpdatedEventHandler;
  private readonly userSessionUpdatedEventHandler: UserSessionUpdatedEventHandler;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(UserSessionDITokens.ConfirmSessionEventHandler)
    confirmSessionEventHandler: ConfirmSessionEventHandler,
    @inject(UserChatDITokens.UserChatCreatedEventHandler)
    userChatCreatedEventHandler: UserChatCreatedEventHandler,
    @inject(InstructorViewDITokens.InstructorStatsEventHandler)
    instructorStatsEventHandler: InstructorStatsEventHandler,
    @inject(InstructorViewDITokens.SessionSettingsEventHandler)
    sessionSettingsEventHandler: SessionSettingsEventHandler,
    @inject(InstructorViewDITokens.InstructorCreatedEventHandler)
    instructorCreatedEventHandler: InstructorCreatedEventHandler,
    @inject(UserViewDITokens.UserUpdatedEventHandler)
    userUpdatedEventHandler: UserUpdatedEventHandler,
    @inject(UserSessionDITokens.UserSessionUpdatedEventHandler)
    userSessionUpdatedEventHandler: UserSessionUpdatedEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.confirmSessionEventHandler = confirmSessionEventHandler;
    this.userChatCreatedEventHandler = userChatCreatedEventHandler;
    this.instructorStatsEventHandler = instructorStatsEventHandler;
    this.sessionSettingsEventHandler = sessionSettingsEventHandler;
    this.instructorCreatedEventHandler = instructorCreatedEventHandler;
    this.userUpdatedEventHandler = userUpdatedEventHandler;
    this.userSessionUpdatedEventHandler = userSessionUpdatedEventHandler;
    this.consumer = this.kafkaConnection.getConsumer(
      QUERY_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [SESSION_TOPIC, CHAT_TOPIC, INSTRUCTOR_TOPIC, USERS_TOPIC];
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
              case UserSessionEvents.SESSION_CONFIRMED: {
                await this.confirmSessionEventHandler.handle(event);
                break;
              }
              case UserChatEvents.USER_CHAT_CREATED: {
                await this.userChatCreatedEventHandler.handle(event);
                break;
              }
              case InstructorViewEvents.INSTRUCTOR_CREATED: {
                await this.instructorCreatedEventHandler.handle(event);
                break;
              }
              case InstructorViewEvents.INSTRUCTOR_STATS_UPDATED: {
                await this.instructorStatsEventHandler.handle(event);
                break;
              }
              case InstructorViewEvents.SESSION_SETTINGS_UPDATED: {
                await this.sessionSettingsEventHandler.handle(event);
                break;
              }
              case UserViewEvents.USER_UPDATED: {
                await this.userUpdatedEventHandler.handle(event);
                break;
              }
              case UserSessionEvents.SESSION_UPDATED: {
                await this.userSessionUpdatedEventHandler.handle(event);
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

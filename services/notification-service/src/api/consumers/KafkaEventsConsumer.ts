import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { EnrollmentEventHandler } from "@core/application/notification/handler/EnrollmentEventHandler";
import type { SessionEventHandler } from "@core/application/notification/handler/SessionEventHandler";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import type { KafkaConnection } from "@infrastructure/adapter/messaging/kafka/KafkaConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { NOTIFICATION_SERVICE_CONSUMER_GROUP } from "@shared/constants/consumer";
import { ENROLLMENTS_TOPIC, SESSION_TOPIC } from "@shared/constants/topic";
import type { NotificationEvent } from "@shared/events/NotificationEvent";
import { tryCatch } from "@shared/util/try-catch";
import { inject } from "inversify";
import type { Consumer, EachMessagePayload } from "kafkajs";

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;
  private readonly enrollmentEventHandler: EnrollmentEventHandler;
  private readonly sessionEventHandler: SessionEventHandler;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(NotificationDITokens.EnrollmentEventHandler)
    enrollmentEventHandler: EnrollmentEventHandler,
    @inject(NotificationDITokens.SessionEventHandler)
    sessionEventHandler: SessionEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.enrollmentEventHandler = enrollmentEventHandler;
    this.sessionEventHandler = sessionEventHandler;
    this.consumer = this.kafkaConnection.getConsumer(
      NOTIFICATION_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [ENROLLMENTS_TOPIC, SESSION_TOPIC];
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
            const event: NotificationEvent = JSON.parse(
              message.value.toString(),
            ) as NotificationEvent;
            this.logger.info(
              `Recieved message: ${JSON.stringify(event)} from ${topic}`,
            );

            switch (event.type) {
              case "enrollment.success": {
                await this.enrollmentEventHandler.handle(event);
                break;
              }
              case "session.confirmed": {
                await this.sessionEventHandler.handle(event);
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

import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentPaymentSuccessfullEventHandler } from '@core/application/enrollment/handler/EnrollmentPaymentSuccessfullEventHandler';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import type { KafkaEvent } from '@infrastructure/adapter/messaging/kafka/types/KafkaEvent';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { COURSE_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { ENROLLMENT_TOPIC } from '@shared/constants/topics';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import { EnrollmentEvents } from '@eduflux-v2/shared/events/course/enum/EnrollmentEvents';

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];

  constructor(
    @inject(EnrollmentDITokens.EnrollmentPaymentSuccessfullEventHandler)
    private readonly enrollmentPaymentSuccessfullEventHandler: EnrollmentPaymentSuccessfullEventHandler,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.topics = [ENROLLMENT_TOPIC];
    this.consumer = this.kafkaConnection.getConsumer(
      COURSE_SERVICE_CONSUMER_GROUP,
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
              case EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESSFULL: {
                await this.enrollmentPaymentSuccessfullEventHandler.handle(
                  event,
                );
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

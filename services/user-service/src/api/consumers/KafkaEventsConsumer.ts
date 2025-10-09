import {
  ENROLLMENTS_TOPIC,
  INSTRUCTOR_TOPIC,
  SESSION_TOPIC,
  USERS_TOPIC,
} from '@shared/constants/topics';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { ProgressDITokens } from '@core/application/progress/di/ProgressDITokens';
import type { CreateProgressUseCase } from '@core/application/progress/usecase/CreateProgressUseCase';
import { USER_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import type { KafkaEvent } from '@core/common/events/KafkaEvent';
import { EnrollmentEvents } from '@core/domain/learner-stats/events/enum/EnrollmentEvents';
import { SessionEvents } from '@core/common/events/enum/SessionEvents';
import type { EnrollmentSuccessEventHandler } from '@core/application/learner-stats/handler/EnrollmentSuccessEventHandler';
import type { SessionUpdatedEventHandler } from '@core/application/learner-stats/handler/SessionUpdatedEventHandler';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;
  private readonly createProgressUseCase: CreateProgressUseCase;
  private readonly enrollmentSuccessEventHanlder: EnrollmentSuccessEventHandler;
  private readonly sesssionUpdatedEventHandler: SessionUpdatedEventHandler;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(ProgressDITokens.CreateProgressUseCase)
    createProgressUseCase: CreateProgressUseCase,
    @inject(LearnerStatsDITokens.SessionUpdatedEventHandler)
    sessionUpdatedEventHandler: SessionUpdatedEventHandler,
    @inject(LearnerStatsDITokens.EnrollmentSuccessEventHandler)
    enrollmentSuccessEventHanlder: EnrollmentSuccessEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.createProgressUseCase = createProgressUseCase;
    this.sesssionUpdatedEventHandler = sessionUpdatedEventHandler;
    this.enrollmentSuccessEventHanlder = enrollmentSuccessEventHanlder;
    this.consumer = this.kafkaConnection.getConsumer(
      USER_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [
      SESSION_TOPIC,
      INSTRUCTOR_TOPIC,
      USERS_TOPIC,
      ENROLLMENTS_TOPIC,
    ];
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
              case EnrollmentEvents.ENROLLMENT_SUCESS: {
                await this.createProgressUseCase.execute({
                  courseId: event.courseId,
                  userId: event.userId,
                });
                await this.enrollmentSuccessEventHanlder.handle(event);
                break;
              }
              case SessionEvents.SESSION_UPDATED: {
                await this.sesssionUpdatedEventHandler.handle(event);
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

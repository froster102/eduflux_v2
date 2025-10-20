import {
  COURSE_TOPIC,
  ENROLLMENT_TOPIC,
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
import type { KafkaEvent } from '@infrastructure/adapter/message/kafka/types/KafkaEvent';
import { EnrollmentEvents } from '@core/domain/learner-stats/events/enum/EnrollmentEvents';
import { SessionEvents } from '@core/common/events/enum/SessionEvents';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorCreatedEventHandler } from '@core/application/views/instructor-view/handler/InstructorCreatedEventHandler';
import { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';
import { SessionSettingsEvents } from '@core/application/views/instructor-view/events/enum/SessionSettingsEvents';
import type { SessionSettingsUpdatedEventHandler } from '@core/application/views/instructor-view/handler/SessionSettingsUpdatedEventHandler';
import type { InstructorStatsUpdatedEventHandler } from '@core/application/views/instructor-view/handler/InstructorStatsUpdatedEventHandler';
import type { SessionCompletedEventHandler } from '@core/application/learner-stats/handler/SessionCompletedEventHandler';
import { UserEvents } from '@core/domain/user/events/UserEvents';
import type { UserUpdatedEventHandler } from '@core/application/views/coordinator/handler/UserUpdatedEventHandler';
import { CourseEvents } from '@shared/constants/events';
import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { CourseCreatedEventHandler } from '@core/application/views/coordinator/handler/CourseCreatedEventHandler';
import type { CourseUpdatedEventHandler } from '@core/application/views/coordinator/handler/CourseUpdateEventHandler';
import type { EnrollmentCompletedEventHandler } from '@core/application/learner-stats/handler/EnrollmentCompletedEventHandler';
import type { CoursePublishedEventHandler } from '@core/application/views/coordinator/handler/CoursePublishedEventHandler';

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topics: string[];
  private readonly logger: LoggerPort;

  constructor(
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(ProgressDITokens.CreateProgressUseCase)
    private readonly createProgressUseCase: CreateProgressUseCase,
    @inject(LearnerStatsDITokens.EnrollmentCompletedEventHandler)
    private readonly enrollmentCompletedEventHanlder: EnrollmentCompletedEventHandler,
    @inject(InstructorViewDITokens.InstructorCreatedEventHandler)
    private readonly instructorCreatedEventHandler: InstructorCreatedEventHandler,
    @inject(InstructorViewDITokens.SessionSettingsUpdatedEventHandler)
    private readonly sessionSettingsUpdatedEventHandler: SessionSettingsUpdatedEventHandler,
    @inject(InstructorViewDITokens.InstructorStatsUpdatedEventHandler)
    private readonly instructorStatsUpdatedEventHandler: InstructorStatsUpdatedEventHandler,
    @inject(LearnerStatsDITokens.SessionCompletedEventHandler)
    private readonly sessionCompletedEventHandler: SessionCompletedEventHandler,
    @inject(InstructorViewDITokens.UserUpdatedEventHandler)
    private readonly userUpdatedEventHandler: UserUpdatedEventHandler,
    @inject(TaughtCourseViewDITokens.CourseCreatedEventHandler)
    private readonly courseCreatedEventHandler: CourseCreatedEventHandler,
    @inject(TaughtCourseViewDITokens.CourseUpdatedEventHandler)
    private readonly courseUpdatedEventHandler: CourseUpdatedEventHandler,
    @inject(TaughtCourseViewDITokens.CoursePublishedEventHandler)
    private readonly coursePublishedEventHandler: CoursePublishedEventHandler,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.consumer = this.kafkaConnection.getConsumer(
      USER_SERVICE_CONSUMER_GROUP,
    );
    this.topics = [
      SESSION_TOPIC,
      INSTRUCTOR_TOPIC,
      USERS_TOPIC,
      ENROLLMENT_TOPIC,
      COURSE_TOPIC,
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
              case EnrollmentEvents.ENROLLMENT_COMPLETED: {
                await this.createProgressUseCase.execute({
                  courseId: event.courseId,
                  userId: event.userId,
                });
                await this.enrollmentCompletedEventHanlder.handle(event);
                break;
              }
              case SessionEvents.SESSION_COMPLETED: {
                await this.sessionCompletedEventHandler.handle(event);
                break;
              }
              case SessionSettingsEvents.SESSION_SETTINGS_UPDATED: {
                await this.sessionSettingsUpdatedEventHandler.handle(event);
                break;
              }
              case InstructorEvents.INSTRUCTOR_CREATED: {
                await this.instructorCreatedEventHandler.handle(event);
                break;
              }
              case InstructorEvents.INSTRUCTOR_STATS_UPDATED: {
                await this.instructorStatsUpdatedEventHandler.handle(event);
                break;
              }
              case UserEvents.USER_UPDATED: {
                await this.userUpdatedEventHandler.handle(event);
                break;
              }
              case CourseEvents.COURSE_CREATED: {
                await this.courseCreatedEventHandler.handle(event);
                break;
              }
              case CourseEvents.COURSE_UPDATED: {
                await this.courseUpdatedEventHandler.handle(event);
                break;
              }
              case CourseEvents.COURSE_PUBLISHED: {
                await this.coursePublishedEventHandler.handle(event);
                break;
              }
              default:
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

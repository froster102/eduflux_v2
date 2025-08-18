import type { ILogger } from '@/shared/common/interfaces/logger.interface';
import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import { kafka } from '@/infrastructure/messaging/kafka/setup';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { COURSE_SERVICE_CONSUMER_GROUP } from '@/shared/constants/consumer';
import { tryCatch } from '@/shared/utils/try-catch';
import { ENROLLMENTS_TOPIC } from '@/shared/constants/topics';

export interface IEnrollmentEvent {
  type: 'enrollment.success';
  correlationId: string;
  data: {
    enrollmentId: string;
    userId: string | null;
    courseId: string;
    occuredAt: string;
  };
}

export class EnrollmentEventsConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(
    @inject(TYPES.UpdateCourseEnrollmentCountUseCase)
    private readonly updateCourseEnrollmentCountUseCase: IUseCase<string, void>,
    @inject(TYPES.Logger) private readonly logger: ILogger,
  ) {
    this.topic = ENROLLMENTS_TOPIC;
    this.consumer = kafka.consumer({
      groupId: COURSE_SERVICE_CONSUMER_GROUP,
    });
    this.logger = logger.fromContext(EnrollmentEventsConsumer.name);
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
            const event = JSON.parse(
              message.value.toString(),
            ) as IEnrollmentEvent;
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

  private async handleEvent(event: IEnrollmentEvent) {
    try {
      switch (event.type) {
        case 'enrollment.success':
          await this.updateCourseEnrollmentCountUseCase.execute(
            event.data.courseId,
          );
      }
    } catch (error) {
      if (
        error instanceof ApplicationException ||
        error instanceof DomainException ||
        error instanceof Error
      ) {
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

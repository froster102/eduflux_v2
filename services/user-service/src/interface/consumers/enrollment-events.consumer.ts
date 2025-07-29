import type { ICreateUserProgressUseCase } from '@/application/use-cases/interface/create-user-progress.interface';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import { inject } from 'inversify';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { USER_SERVICE } from '@/shared/constants/services';
import { ENROLLMENTS_TOPIC } from '@/shared/constants/topics';
import { kafka } from '@/infrastructure/messaging/kafka/kafka';
import { USER_SERVICE_CONSUMER_GROUP } from '@/shared/constants/consumer';
import { tryCatch } from '@/shared/utils/try-catch';

export interface IEnrollmentEvent {
  type: 'enrollment.success';
  correlationId: string;
  data: {
    enrollmentId: string;
    userId: string;
    courseId: string;
    occuredAt: string;
  };
}

export class EnrollmentEventsConsumer {
  private consumer: Consumer;
  private logger = new Logger(USER_SERVICE);
  private topic: string;

  constructor(
    @inject(TYPES.CreateUserProgressUseCase)
    private readonly createUserProgressUseCase: ICreateUserProgressUseCase,
  ) {
    this.topic = ENROLLMENTS_TOPIC;
    this.consumer = kafka.consumer({
      groupId: USER_SERVICE_CONSUMER_GROUP,
    });
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
          await this.createUserProgressUseCase.execute({
            courseId: event.data.courseId,
            userId: event.data.userId,
          });
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

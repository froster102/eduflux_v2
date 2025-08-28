import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Exception } from '@core/common/errors/Exception';
import { ProgressDITokens } from '@core/domain/progress/di/ProgressDITokens';
import type { CreateProgressUseCase } from '@core/domain/progress/usecase/CreateProgressUseCase';
import { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { USER_SERVICE_CONSUMER_GROUP } from '@shared/constants/consumer';
import { ENROLLMENTS_TOPIC } from '@shared/constants/topics';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import type { Consumer, EachMessagePayload } from 'kafkajs';

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

export class KafkaEventsConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(
    @inject(InfrastructureDITokens.KafkaEventBusConnection)
    private readonly kafkaEventBusConnection: KafkaEventBusConnection,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(ProgressDITokens.CreateProgressUseCase)
    private readonly createProgressUseCase: CreateProgressUseCase,
  ) {
    this.logger = logger.fromContext(KafkaEventsConsumer.name);
    this.topic = ENROLLMENTS_TOPIC;
    this.consumer = this.kafkaEventBusConnection.getConsumer(
      USER_SERVICE_CONSUMER_GROUP,
    );
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
          await this.createProgressUseCase.execute({
            courseId: event.data.courseId,
            userId: event.data.userId,
          });
      }
    } catch (error) {
      if (error instanceof Exception || error instanceof Error) {
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

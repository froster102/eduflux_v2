import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { kafka } from '@/infrastructure/messaging/kafka/kafka';
import { USER_SERVICE } from '@/shared/constants/services';
import {
  USER_EVENTS,
  USER_SERVICE_CONSUMER_GROUP,
} from '@/shared/constants/topics';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import { inject } from 'inversify';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { IEvent } from './event.interface';
import { CreateUserDto } from '@/application/dtos/create-user.dto';

export class UserEventsConsumer {
  private consumer: Consumer;
  private logger = new Logger(USER_SERVICE);
  private topic: string;

  constructor(
    @inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {
    this.topic = USER_EVENTS;
    this.consumer = kafka.consumer({ groupId: USER_SERVICE_CONSUMER_GROUP });
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
            const event = JSON.parse(message.value.toString()) as IEvent;
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

  private async handleEvent(event: IEvent) {
    switch (event.type) {
      case 'user.created':
        await this.createUserUseCase.execute(event.payload as CreateUserDto);
    }
  }
}

import { Logger } from '@/shared/utils/logger';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { tryCatch } from '@/shared/utils/try-catch';
import { USERS_TOPIC } from '@/shared/constants/topics';
import { kafka } from '../kafka';
import { AUTH_SERVICE_CONSUMER_GROUP } from '@/shared/constants/consumers';
import { AppException } from '@/shared/exceptions/app.exception';
import { userService } from '@/services';

export interface IUserEvent {
  type: 'user.update';
  correlationId: string;
  data: {
    id: string;
    name?: string;
    image?: string;
    occuredAt: string;
  };
}

export class UserEventsConsumer {
  private consumer: Consumer;
  private logger = new Logger(AUTH_SERVICE);
  private topic: string;

  constructor() {
    this.topic = USERS_TOPIC;
    this.consumer = kafka.consumer({
      groupId: AUTH_SERVICE_CONSUMER_GROUP,
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
            const event = JSON.parse(message.value.toString()) as IUserEvent;
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

  private async handleEvent(event: IUserEvent) {
    try {
      switch (event.type) {
        case 'user.update':
          await userService.updateUser({
            id: event.data.id,
            name: event.data.name,
            image: event.data.image,
          });
      }
    } catch (error) {
      if (error instanceof AppException || error instanceof Error) {
        console.log(error);
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

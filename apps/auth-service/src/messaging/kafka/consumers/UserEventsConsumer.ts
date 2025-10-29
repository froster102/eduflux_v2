import type { Consumer, EachMessagePayload } from 'kafkajs';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { USERS_TOPIC } from '@/shared/constants/topics';
import { kafka } from '../kafka';
import { AUTH_SERVICE_CONSUMER_GROUP } from '@/shared/constants/consumers';
import { logger } from '@/shared/utils/logger';
import { APIError } from 'better-auth/api';
import { updateUser } from '@/database/db';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';
import { UserEvents } from '@eduflux-v2/shared/events/user/enum/UserEvents';

export class UserEventsConsumer {
  private consumer: Consumer;
  private logger = logger.fromContext(UserEventsConsumer.name);
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
            const event = JSON.parse(
              message.value.toString(),
            ) as UserUpdatedEvent;
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

  private async handleEvent(event: UserUpdatedEvent) {
    try {
      switch (event.type) {
        case UserEvents.USER_UPDATED:
          await updateUser({
            id: event.id,
            name: event.name,
            image: event.image,
          });
      }
    } catch (error) {
      if (error instanceof APIError || error instanceof Error) {
        this.logger.error(
          `Error handling the ${event.type} error:${error.message}`,
        );
      }
    }
  }
}

import { IEventPublisher } from '@/domain/services/event-publisher.service';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { Logger } from '@/shared/utils/logger';
import { Producer } from 'kafkajs';
import { kafka } from '../kafka';
import { IEvent } from '@/shared/interfaces/event.interface';

export class KafkaEventPublisher implements IEventPublisher {
  private producer: Producer;
  private logger = new Logger(AUTH_SERVICE);

  constructor() {
    this.producer = kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
      this.logger.info(`Eshtablished connection to kafka producer`);
    } catch (error) {
      this.logger.error(
        `Failed to eshtablish connection to kafka producer ${(error as Record<string, any>).message}`,
        error as Record<string, any>,
      );
    }
  }

  async publish(topic: string, event: IEvent): Promise<void> {
    try {
      await this.producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(event) }],
      });
      this.logger.info(
        `Published event to topic ${topic}: ${JSON.stringify(event)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish messsage to Kafka producer: ${(error as Record<string, any>).message}`,
        error as Record<string, any>,
      );
      process.exit(1);
    }
  }
}

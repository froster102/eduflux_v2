import type { ILogger } from '@/shared/common/interface/logger.interface';
import { Kafka, Producer } from 'kafkajs';
import { tryCatch } from '@/shared/utils/try-catch';
import {
  IEnrollmentEvent,
  IMessageBrokerGatway,
} from '@/application/ports/message-broker.gateway';
import { kafka } from '../kafka/setup';
import { asyncLocalStorage } from '@/shared/utils/store';
import { v4 as uuidV4 } from 'uuid';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export class KafkaProducerAdapter implements IMessageBrokerGatway {
  private kafka: Kafka;
  private producer: Producer;

  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
    this.logger = logger.fromContext(KafkaProducerAdapter.name);
    this.kafka = kafka;
    this.producer = this.kafka.producer();
  }

  async publish(topic: string, event: IEnrollmentEvent): Promise<void> {
    const messageValue = JSON.stringify(event);
    const correlationId =
      asyncLocalStorage.getStore()?.get('correlationId') || uuidV4();

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.type,
            value: messageValue,
            headers: {
              'x-correlation-id': correlationId,
            },
          },
        ],
      });
      this.logger.info(`Sent message ${messageValue} to ${topic}`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Failed to publish message to Kafka producer: ${errorMessage}`,
      );
    }
  }

  async connect(): Promise<void> {
    const { error } = await tryCatch(this.producer.connect());
    if (error) {
      this.logger.error(
        `Failed to connect to Kafka producer: ${error.message}`,
      );
      throw new Error(error.message);
    }
    this.logger.info(`Established connection to Kafka producer.`);
  }

  async disconnect(): Promise<void> {
    const { error } = await tryCatch(this.producer.disconnect());
    if (error) {
      this.logger.error(
        `Failed to disconnect Kafka producer: ${error.message}`,
      );
    } else {
      this.logger.info('Kafka producer disconnected gracefully.');
    }
  }
}

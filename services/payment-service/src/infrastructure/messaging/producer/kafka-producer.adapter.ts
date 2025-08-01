import type { ILogger } from '@/shared/common/interface/logger.interface';
import {
  IMessageBrokerGatway,
  IPaymentEvent,
} from '@/application/ports/message-broker.gateway';
import { Kafka, Producer } from 'kafkajs';
import { kafka } from '../kafka/setup';
import { tryCatch } from '@/shared/utils/try-catch';
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

  async publish(topic: string, event: IPaymentEvent): Promise<void> {
    const messageValue = JSON.stringify(event);

    await this.producer
      .send({
        topic,
        messages: [
          {
            key: event.type,
            value: messageValue,
            headers: {
              'x-correlation-id': event.correlationId || '',
            },
          },
        ],
      })
      .catch((error: Error) => {
        this.logger.error(
          `Failed to publish messsage to Kafka producer: ${error.message}`,
        );
      });
  }

  async connect(): Promise<void> {
    const { error } = await tryCatch(this.producer.connect());
    if (error) {
      this.logger.error(`Failed to connect to kafka producer ${error.message}`);
      throw new Error(error.message);
    }
    this.logger.info(`Eshtablished connection to kafka producer.`);
  }

  async disconnect(): Promise<void> {
    const { error } = await tryCatch(this.producer.disconnect());
    if (error) {
      this.logger.error(`Failed to disconnect kafka producer ${error.message}`);
    }
  }
}

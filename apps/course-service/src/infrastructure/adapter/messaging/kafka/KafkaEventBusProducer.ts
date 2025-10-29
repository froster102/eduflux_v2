import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import type { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { COURSE_TOPIC } from '@shared/constants/topics';
import { inject } from 'inversify';
import type { Producer } from 'kafkajs';

export class KafkaEventBusProducerAdapter implements EventBusPort {
  private readonly producer: Producer;
  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
  ) {
    this.logger = logger.fromContext(KafkaEventBusProducerAdapter.name);

    this.producer = this.kafkaConnection.getProducer();
    this.producer.on('producer.connect', () => {
      this.logger.debug('Connected to kafka producer');
    });
    this.producer.on('producer.disconnect', () => {
      this.logger.debug('Disconnected from kafka producer');
    });
  }

  async connect() {
    const producer = this.producer;
    const { error } = await tryCatch(producer.connect());
    if (error) {
      this.logger.error(
        `Failed to connect to kafka producer error${error?.message} `,
        error as Record<string, any>,
      );
      process.exit(1);
    }
  }

  async sendEvent<TEvent extends { type: string; id: string }>(
    event: TEvent,
  ): Promise<void> {
    const messageValue = JSON.stringify(event);
    let topic: string;
    if (
      event.type.startsWith('course') ||
      event.type.startsWith('enrollment')
    ) {
      topic = COURSE_TOPIC;
    } else {
      this.logger.warn('Event no published as not topic was defined');
      return;
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.type,
            value: messageValue,
            headers: {
              //attach correlation id from async store
              'x-correlation-id': '',
            },
          },
        ],
      });
      this.logger.info(`Sent message ${messageValue} to ${topic}`);
    } catch (error) {
      const errorMessage = (error as Error)?.message;
      this.logger.error(
        `Failed to publish message to Kafka producer: ${errorMessage}`,
      );
    }
  }
}

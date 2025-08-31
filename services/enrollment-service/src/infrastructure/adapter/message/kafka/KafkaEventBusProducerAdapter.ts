import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import type { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ENROLLMENTS_TOPIC } from '@shared/constants/topics';
import { inject } from 'inversify';
import type { Producer } from 'kafkajs';

export class KafkaEventBusProducerAdapter implements EventBusPort {
  private readonly producer: Producer;
  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(InfrastructureDITokens.KafkaEventBusConnection)
    private readonly kafkaEventBusConnection: KafkaEventBusConnection,
  ) {
    this.logger = logger.fromContext('KAFKA_EVENT_BUS');

    this.producer = this.kafkaEventBusConnection.getProducer();
  }

  async sendEvent<TEvent extends { type: string }>(
    event: TEvent,
  ): Promise<void> {
    const messageValue = JSON.stringify(event);
    let topic: string;
    if (event.type.startsWith('enrollment')) {
      topic = ENROLLMENTS_TOPIC;
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
      const errorMessage = (error as Error).message;
      this.logger.error(
        `Failed to publish message to Kafka producer: ${errorMessage}`,
      );
    }
  }
}

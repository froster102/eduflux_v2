import type { EventDeserializer } from '@shared/infrastructure/messaging/EventDeserializer';
import { RabbitMqConnection } from './RabbitMQConnection';
import { RabbitMQConsumer } from './RabbitMQConsumer';
import type { EventSubscriberPort } from '@shared/ports/message/EventSubscriberPort';
import type { Event } from '@shared/events/Event';

export class RabbitMQConsumerFactory {
  constructor(
    private deserializer: EventDeserializer,
    private connection: RabbitMqConnection,
    private maxRetries: number,
  ) {}

  build(
    subscriber: EventSubscriberPort<Event>,
    exchange: string,
    queueName: string,
  ) {
    return new RabbitMQConsumer({
      subscriber,
      deserializer: this.deserializer,
      connection: this.connection,
      queueName,
      exchange,
      maxRetries: this.maxRetries,
    });
  }
}

import type { ConsumeMessage } from 'amqplib';
import { RabbitMqConnection } from './RabbitMQConnection';
import type { EventSubscriberPort } from '@shared/ports/message/EventSubscriberPort';
import type { Event } from '@shared/events/Event';
import type { EventDeserializer } from '@shared/infrastructure/messaging/EventDeserializer';

export class RabbitMQConsumer {
  private subscriber: EventSubscriberPort<Event>;
  private deserializer: EventDeserializer;
  private connection: RabbitMqConnection;
  private maxRetries: number;
  private queueName: string;
  private exchange: string;

  constructor(params: {
    subscriber: EventSubscriberPort<Event>;
    deserializer: EventDeserializer;
    connection: RabbitMqConnection;
    queueName: string;
    exchange: string;
    maxRetries: number;
  }) {
    this.subscriber = params.subscriber;
    this.deserializer = params.deserializer;
    this.connection = params.connection;
    this.maxRetries = params.maxRetries;
    this.queueName = params.queueName;
    this.exchange = params.exchange;
  }

  async onMessage(message: ConsumeMessage) {
    const content = message.content.toString();
    const event = this.deserializer.deserialize(content);

    try {
      await this.subscriber.on(event);
    } catch {
      await this.handleError(message);
    } finally {
      this.connection.ack(message);
    }
  }

  private async handleError(message: ConsumeMessage) {
    if (this.hasBeenRedeliveredTooMuch(message)) {
      await this.deadLetter(message);
    } else {
      await this.retry(message);
    }
  }

  private async retry(message: ConsumeMessage) {
    await this.connection.retry(message, this.queueName, this.exchange);
  }

  private async deadLetter(message: ConsumeMessage) {
    await this.connection.deadLetter(message, this.queueName, this.exchange);
  }

  private hasBeenRedeliveredTooMuch(message: ConsumeMessage) {
    if (this.hasBeenRedelivered(message)) {
      const count = parseInt(
        message.properties.headers!['redelivery_count'] as string,
      );
      return count >= this.maxRetries;
    }
    return false;
  }

  private hasBeenRedelivered(message: ConsumeMessage) {
    return message.properties.headers!['redelivery_count'] !== undefined;
  }
}

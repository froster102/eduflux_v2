import type { MessageBrokerPort } from '@shared/ports/message/MessageBrokerPort';
import { RabbitMqConnection } from './RabbitMQConnection';
import { RabbitMQConsumerFactory } from './RabbitMQConsumerFactory';
import { RabbitMQqueueFormatter } from './RabbitMQqueueFormatter';
import type { EventSubscribers } from '@shared/infrastructure/messaging/EventSubscribers';
import { EventDeserializer } from '@shared/infrastructure/messaging/EventDeserializer';
import type { Event } from '@shared/events/Event';
import { EventJsonSerializer } from '@shared/infrastructure/messaging/EventJsonSerializer';
import { unmanaged } from 'inversify';
export class RabbitMQMessageBrokerAdapter implements MessageBrokerPort {
  // private failoverPublisher: DomainEventFailoverPublisher;
  private connection: RabbitMqConnection;
  private exchange: string;
  private queueNameFormatter: RabbitMQqueueFormatter;
  private maxRetries: number;

  constructor(
    @unmanaged()
    params: {
      // failoverPublisher: DomainEventFailoverPublisher;
      connection: RabbitMqConnection;
      exchange: string;
      queueNameFormatter: RabbitMQqueueFormatter;
      maxRetries: number;
    },
  ) {
    const { connection, exchange } = params;
    // this.failoverPublisher = failoverPublisher;
    this.connection = connection;
    this.exchange = exchange;
    this.queueNameFormatter = params.queueNameFormatter;
    this.maxRetries = params.maxRetries;
  }

  async addSubscribers(subscribers: EventSubscribers): Promise<void> {
    const deserializer = EventDeserializer.configure(subscribers);
    const consumerFactory = new RabbitMQConsumerFactory(
      deserializer,
      this.connection,
      this.maxRetries,
    );

    for (const subscriber of subscribers.items) {
      const queueName = this.queueNameFormatter.format(subscriber);
      const rabbitMQConsumer = consumerFactory.build(
        subscriber,
        this.exchange,
        queueName,
      );

      await this.connection.consume(
        queueName,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        rabbitMQConsumer.onMessage.bind(rabbitMQConsumer),
      );
    }
  }

  async publish(event: Event): Promise<void> {
    try {
      const routingKey = event.name;
      const content = this.toBuffer(event);
      const options = this.options(event);

      await this.connection.publish({
        exchange: this.exchange,
        routingKey,
        content,
        options,
      });
    } catch {
      // await this.failoverPublisher.publish(event);
    }
  }

  private options(event: Event) {
    return {
      messageId: event.id,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
    };
  }

  private toBuffer(event: Event): Buffer {
    const eventJSON = EventJsonSerializer.serialize(event);

    return Buffer.from(eventJSON);
  }
}

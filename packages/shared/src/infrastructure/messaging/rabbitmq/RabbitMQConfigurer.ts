import type { Event } from '@shared/events/Event';
import type { EventSubscriberPort } from '@shared/ports/message/EventSubscriberPort';
import type { RabbitMqConnection } from '@shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { RabbitMQExchangeNameFormatter } from '@shared/infrastructure/messaging/rabbitmq/RabbitMQExchangeNameFormatter';
import type { RabbitMQqueueFormatter } from '@shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import type { ExchangeSetting } from '@shared/infrastructure/messaging/rabbitmq/ExchangeSetting';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';

export class RabbitMQConfigurer {
  constructor(
    private connection: RabbitMqConnection,
    private queueNameFormatter: RabbitMQqueueFormatter,
    private messageRetryTtl: number,
    private logger: LoggerPort,
  ) {
    this.logger = logger.fromContext('RabbitMQConfigurer');
  }

  async configure(params: {
    exchange: ExchangeSetting;
    subscribers: Array<EventSubscriberPort<Event>>;
  }): Promise<void> {
    this.logger.debug('Configuring RabbitMQ', {
      exchange: params.exchange,
      subscribers: params.subscribers.map(
        (subscriber) => subscriber.constructor.name,
      ),
    });
    const retryExchange = RabbitMQExchangeNameFormatter.retry(
      params.exchange.name,
    );
    const deadLetterExchange = RabbitMQExchangeNameFormatter.deadLetter(
      params.exchange.name,
    );

    await this.connection.exchange(params.exchange);
    await this.connection.exchange({ name: retryExchange, type: 'topic' });
    await this.connection.exchange({ name: deadLetterExchange, type: 'topic' });

    for (const subscriber of params.subscribers) {
      await this.addQueue(subscriber, params.exchange.name);
    }
  }

  private async addQueue(
    subscriber: EventSubscriberPort<Event>,
    exchange: string,
  ) {
    const retryExchange = RabbitMQExchangeNameFormatter.retry(exchange);
    const deadLetterExchange =
      RabbitMQExchangeNameFormatter.deadLetter(exchange);

    const routingKeys = this.getRoutingKeysFor(subscriber);

    const queue = this.queueNameFormatter.format(subscriber);
    const deadLetterQueue =
      this.queueNameFormatter.formatDeadLetter(subscriber);
    const retryQueue = this.queueNameFormatter.formatRetry(subscriber);

    await this.connection.queue({ routingKeys, name: queue, exchange });
    this.logger.debug(
      `Declared queue: ${queue}. Bound to exchange: ${exchange} with routing keys: [${routingKeys.join(', ')}]`,
    );

    this.logger.debug(
      `Configured resilience for queue: ${queue}. Retry queue: ${retryQueue}, DLQ: ${deadLetterQueue}`,
    );
    await this.connection.queue({
      routingKeys: [queue],
      name: retryQueue,
      exchange: retryExchange,
      messageTtl: this.messageRetryTtl,
      deadLetterExchange: exchange,
      deadLetterQueue: queue,
    });
    await this.connection.queue({
      routingKeys: [queue],
      name: deadLetterQueue,
      exchange: deadLetterExchange,
    });
  }

  private getRoutingKeysFor(subscriber: EventSubscriberPort<Event>) {
    const routingKeys = subscriber
      .subscribedTo()
      .map((event) => event.EVENT_NAME);

    const queue = this.queueNameFormatter.format(subscriber);
    routingKeys.push(queue);

    return routingKeys;
  }
}

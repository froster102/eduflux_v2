/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import amqplib, { type ConsumeMessage, type ConfirmChannel } from 'amqplib';
import { RabbitMQExchangeNameFormatter } from './RabbitMQExchangeNameFormatter';
import { SharedCoreDITokens } from '@shared/di/SharedCoreDITokens';
import { inject } from 'inversify';
import type { RabbitMQConnectionSettings } from '@shared/infrastructure/messaging/rabbitmq/RabbitMqConnectionSettings';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import type { ExchangeSetting } from '@shared/infrastructure/messaging/rabbitmq/ExchangeSetting';
import { SharedConfigDITokens } from '@shared/di/SharedConfigDITokens';

export class RabbitMqConnection {
  private connectionSettings: RabbitMQConnectionSettings;
  private channel?: ConfirmChannel;
  private connection?: amqplib.ChannelModel;

  constructor(
    @inject(SharedConfigDITokens.RabbitMQConnectionConfig)
    private readonly config: RabbitMQConnectionSettings,
    @inject(SharedCoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.connectionSettings = config;
  }

  async connect() {
    this.connection = await this.amqpConnect();
    this.logger.debug('Connected to RabbitMQ');
    this.channel = await this.amqpChannel();
  }

  async exchange(params: ExchangeSetting) {
    if (!this.channel) return;
    return await this.channel.assertExchange(params.name, params.type, {
      durable: true,
    });
  }

  async queue(params: {
    exchange: string;
    name: string;
    routingKeys: string[];
    deadLetterExchange?: string;
    deadLetterQueue?: string;
    messageTtl?: number;
  }) {
    if (!this.channel) throw new Error('RabbitMQ channel not connected.');

    const durable = true;
    const exclusive = false;
    const autoDelete = false;
    const args = this.getQueueArguments(params);

    await this.channel.assertQueue(params.name, {
      exclusive,
      durable,
      autoDelete,
      arguments: args,
    });
    for (const routingKey of params.routingKeys) {
      await this.channel.bindQueue(params.name, params.exchange, routingKey);
    }
  }

  private getQueueArguments(params: {
    exchange: string;
    name: string;
    routingKeys: string[];
    deadLetterExchange?: string;
    deadLetterQueue?: string;
    messageTtl?: number;
  }): Record<string, any> {
    let args: Record<string, any> = {};
    if (params.deadLetterExchange) {
      args = { ...args, 'x-dead-letter-exchange': params.deadLetterExchange };
    }
    if (params.deadLetterQueue) {
      args = { ...args, 'x-dead-letter-routing-key': params.deadLetterQueue };
    }
    if (params.messageTtl) {
      args = { ...args, 'x-message-ttl': params.messageTtl };
    }
    return args;
  }

  async deleteQueue(queue: string) {
    if (!this.channel) throw new Error('RabbitMQ channel not connected.');
    return await this.channel.deleteQueue(queue);
  }

  private async amqpConnect(): Promise<amqplib.ChannelModel> {
    const { hostname, port, secure } = this.connectionSettings.connection;
    const { username, password, vhost } = this.connectionSettings;
    const protocol = secure ? 'amqps' : 'amqp';

    const connection = await amqplib.connect({
      protocol,
      hostname,
      port,
      username,
      password,
      vhost,
    });

    return connection;
  }

  private async amqpChannel(): Promise<ConfirmChannel> {
    if (!this.connection)
      throw new Error('RabbitMQ connection not established.');
    const channel = await this.connection.createConfirmChannel();
    await channel.prefetch(1);

    return channel;
  }

  async publish(params: {
    exchange: string;
    routingKey: string;
    content: Buffer;
    options: {
      messageId: string;
      contentType: string;
      contentEncoding: string;
      priority?: number;
      headers?: Record<string, any>;
    };
  }): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ channel not connected.');
    const { routingKey, content, options, exchange } = params;
    console.log(params);
    return new Promise((resolve, reject) => {
      this.channel!.publish(
        exchange,
        routingKey,
        content,
        options,
        (error: Error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        },
      );
    });
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
      this.logger.debug('Disconnected from RabbitMQ');
      return;
    }
    return;
  }

  async consume(queue: string, onMessage: (message: ConsumeMessage) => void) {
    if (!this.channel) throw new Error('RabbitMQ channel not connected.');

    await this.channel.consume(queue, (message: ConsumeMessage | null) => {
      if (!message) {
        return;
      }
      onMessage(message);
    });
  }

  ack(message: ConsumeMessage) {
    if (!this.channel) throw new Error('RabbitMQ channel not connected.');
    this.channel.ack(message);
  }

  async retry(message: ConsumeMessage, queue: string, exchange: string) {
    const retryExchange = RabbitMQExchangeNameFormatter.retry(exchange);
    const options = this.getMessageOptions(message);

    return await this.publish({
      exchange: retryExchange,
      routingKey: queue,
      content: message.content,
      options,
    });
  }

  async deadLetter(message: ConsumeMessage, queue: string, exchange: string) {
    const deadLetterExchange =
      RabbitMQExchangeNameFormatter.deadLetter(exchange);
    const options = this.getMessageOptions(message);

    return await this.publish({
      exchange: deadLetterExchange,
      routingKey: queue,
      content: message.content,
      options,
    });
  }

  // ... (getMessageOptions/incrementRedeliveryCount methods remain largely the same)

  private getMessageOptions(message: ConsumeMessage) {
    const { messageId, contentType, contentEncoding, priority } =
      message.properties;

    const options = {
      messageId: messageId as string,
      headers: this.incrementRedeliveryCount(message),
      contentType: contentType as string,
      contentEncoding: contentEncoding as string,
      priority,
    };
    return options;
  }

  private incrementRedeliveryCount(
    message: ConsumeMessage,
  ): Record<string, any> {
    const headers = message.properties.headers || {};

    if (this.hasBeenRedelivered(message)) {
      const count = parseInt(String(headers['redelivery_count']));
      headers['redelivery_count'] = count + 1;
    } else {
      headers['redelivery_count'] = 1;
    }

    return headers;
  }

  private hasBeenRedelivered(message: ConsumeMessage): boolean {
    return (
      message.properties.headers !== undefined &&
      message.properties.headers['redelivery_count'] !== undefined
    );
  }
}

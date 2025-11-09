import 'reflect-metadata';
import { HttpServer } from '@/http/server';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { rabbitMQConfig } from '@/shared/config/rabbitmqConfig';
import { logger } from '@/shared/utils/logger';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQConfigurer } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConfigurer';
import { UserUpdatedEventSubscriberService } from '@/messaging/subscribers/UserUpdatedEventSubscriberService';
import { envVariables } from '@/shared/env/env-variables';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
export class AuthService {
  private httpServer?: HttpServer;

  async start(): Promise<void> {
    const httpServerPort = envVariables.HTTP_SERVER_PORT;
    this.httpServer = new HttpServer(httpServerPort);
    await this.configureMessagaseBroker();
    this.httpServer.start();
  }

  private async configureMessagaseBroker(): Promise<void> {
    const rabbitMqConnection = new RabbitMqConnection(rabbitMQConfig, logger);
    const rabbitMQConfigurer = new RabbitMQConfigurer(
      rabbitMqConnection,
      new RabbitMQqueueFormatter('auth-service'),
      3,
      logger,
    );
    const subscribers = { items: [new UserUpdatedEventSubscriberService()] };
    await rabbitMqConnection.connect();
    await rabbitMQConfigurer.configure({
      exchange: { name: 'application-events', type: 'topic' },
      subscribers: subscribers.items,
    });
    const messageBroker = new RabbitMQMessageBrokerAdapter({
      connection: rabbitMqConnection,
      exchange: 'application-events',
      queueNameFormatter: new RabbitMQqueueFormatter('auth-service'),
      maxRetries: 3,
    });
    await messageBroker.addSubscribers(subscribers);
  }
}

import { HttpServer } from '@api/http/HttpServer';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import type { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQConfigurer } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConfigurer';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import type { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { SessionServiceEventSubscribers } from '@infrastructure/event/SessionServiceEventSubscribers';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class SessionService {
  private server?: HttpServer;

  async start(): Promise<void> {
    this.server = new HttpServer(HttpServerConfig.PORT);
    await this.configureDatabase();
    await this.configureMessagaseBroker();
    this.server.start();
  }

  private async configureDatabase(): Promise<void> {
    const mongooseConnection = container.get<MongooseConnection>(
      SharedInfrastructureDITokens.MongooseConnection,
    );
    await mongooseConnection.connect();
  }

  private async configureMessagaseBroker(): Promise<void> {
    const rabbitMqConnection = container.get<RabbitMqConnection>(
      SharedInfrastructureDITokens.RabbitMQConnection,
    );

    const rabbitMQConfigurer = new RabbitMQConfigurer(
      rabbitMqConnection,
      new RabbitMQqueueFormatter('session-service'),
      3,
      container.get<LoggerPort>(SharedCoreDITokens.Logger),
    );

    const subscribers = SessionServiceEventSubscribers.from(container);

    await rabbitMqConnection.connect();
    await rabbitMQConfigurer.configure({
      exchange: { name: 'application-events', type: 'topic' },
      subscribers: subscribers.items,
    });
    const messageBroker = container.get<MessageBrokerPort>(
      SharedCoreDITokens.MessageBroker,
    );
    await messageBroker.addSubscribers(subscribers);
  }
}

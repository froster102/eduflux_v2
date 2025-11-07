import type { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { container } from '@application/di/RootModule';
import type { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { HttpServer } from '@application/api/http/HttpServer';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import { RabbitMQConfigurer } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConfigurer';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { AnalyticsServiceEventSubscribers } from '@infrastructure/event/AnalyticsServiceEventSubscribers';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class ServerApplication {
  async run(): Promise<void> {
    await this.connectDatabase();
    await this.configureMessageBroker();
    this.runHttpServer();
  }

  async connectDatabase() {
    const mongooseConnection = container.get<MongooseConnection>(
      SharedInfrastructureDITokens.MongooseConnection,
    );
    await mongooseConnection.connect();
  }

  async configureMessageBroker() {
    const rabbitMqConnection = container.get<RabbitMqConnection>(
      SharedInfrastructureDITokens.RabbitMQConnection,
    );

    const rabbitMQConfigurer = new RabbitMQConfigurer(
      rabbitMqConnection,
      new RabbitMQqueueFormatter('analytics-service'),
      3,
      container.get<LoggerPort>(SharedCoreDITokens.Logger),
    );

    const subscribers = AnalyticsServiceEventSubscribers.from(container);

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

  runHttpServer() {
    const server = new HttpServer(HttpServerConfig.HTTP_SERVER_PORT);
    server.start();
  }

  static new(): ServerApplication {
    return new ServerApplication();
  }
}

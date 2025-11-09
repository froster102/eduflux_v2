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
import { GrpcServer } from '@api/grpc/GrpcServer';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';

export class SessionService {
  private httpServer?: HttpServer;
  private grpcServer?: GrpcServer;

  async start(): Promise<void> {
    this.httpServer = new HttpServer(HttpServerConfig.PORT);
    this.grpcServer = new GrpcServer(GrpcServerConfig.GRPC_SERVER_PORT);
    await this.configureDatabase();
    await this.configureMessagaseBroker();
    this.startCronServices();
    this.httpServer.start();
    this.grpcServer.start();
  }

  private startCronServices() {
    const cronServices = container.get<ICronServices>(
      InfrastructureDITokens.CronServices,
    );
    cronServices.register();
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

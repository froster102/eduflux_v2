import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { FileStorageGatewayPort } from '@core/application/course/port/gateway/FileStorageGatewayPort';
import { MongooseCategoryRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/category/MongooseCategoryRepositoryAdapter';
import { CloudinaryFileStorageAdapter } from '@infrastructure/adapter/storage/CloudinaryFileStorageAdapter';
import { ContainerModule } from 'inversify';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { envVariables } from '@shared/env/env-variables';
import { COURSE_SERVICE } from '@shared/constants/services';
import { AsyncLocalStorage } from 'node:async_hooks';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { MongooseConnectionConfig } from '@shared/config/MongooseConnectionConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Database connection
    options
      .bind<MongooseConnection>(SharedInfrastructureDITokens.MongooseConnection)
      .to(MongooseConnection)
      .inSingletonScope();

    //Logger
    const config: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: COURSE_SERVICE,
      asyncLocalStorage: new AsyncLocalStorage<Map<string, string>>(),
      enableCorrelationId: true,
    };
    options
      .bind<LoggerPort>(SharedCoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(config));

    // Repository
    options
      .bind<CategoryRepositoryPort>(CourseDITokens.CategoryRepository)
      .to(MongooseCategoryRepositoryAdapter);

    //RabbitMQ connection
    options
      .bind<RabbitMqConnection>(SharedInfrastructureDITokens.RabbitMQConnection)
      .to(RabbitMqConnection)
      .inSingletonScope();

    //Message broker
    options
      .bind<MessageBrokerPort>(SharedCoreDITokens.MessageBroker)
      .toDynamicValue((context) => {
        const connection = context.get<RabbitMqConnection>(
          SharedInfrastructureDITokens.RabbitMQConnection,
        );
        const config = context.get<RabbitMQConfig>(
          SharedConfigDITokens.RabbitMQConnectionConfig,
        );

        const params = {
          connection: connection,
          exchange: 'application-events',
          queueNameFormatter: new RabbitMQqueueFormatter('chat-service'),
          maxRetries: config.maxRetries,
        };

        return new RabbitMQMessageBrokerAdapter(params);
      })
      .inSingletonScope();

    // Gateway bindings
    options
      .bind<UserServiceGatewayPort>(CourseDITokens.UserServiceGateway)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();

    options
      .bind<FileStorageGatewayPort>(CourseDITokens.FileStorageGateway)
      .to(CloudinaryFileStorageAdapter);
    options
      .bind<FileStorageGatewayPort>(AssetDITokens.FileStorageGateway)
      .to(CloudinaryFileStorageAdapter);

    //Config
    options
      .bind(SharedConfigDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);
    options
      .bind<RabbitMQConfig>(SharedConfigDITokens.RabbitMQConnectionConfig)
      .toConstantValue(new RabbitMQConfig());
    options
      .bind<MongooseConnectionConfig>(
        SharedConfigDITokens.MongooseConnectionConfig,
      )
      .toConstantValue(MongooseConnectionConfig);
  },
);

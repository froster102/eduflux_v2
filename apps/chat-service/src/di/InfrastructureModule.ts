import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import { GrpcCourseServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { CHAT_SERVICE } from '@shared/constants/service';
import { asyncLocalStorage } from '@shared/utils/async-store';
import { envVariables } from '@shared/env/envVariables';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { MongooseConnectionConfig } from '@shared/config/MongooseConnectionConfig';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import type { CacheClientPort } from '@eduflux-v2/shared/ports/cache/CacheClientPort';
import { RedisCacheClientAdapter } from '@eduflux-v2/shared/adapters/cache/RedisCacheClientAdapter';
import { RedisConfig } from '@shared/config/RedisConfig';

export const infrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Database connection
    options
      .bind<MongooseConnection>(SharedInfrastructureDITokens.MongooseConnection)
      .to(MongooseConnection)
      .inSingletonScope();

    //Logger
    const config: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: CHAT_SERVICE,
      asyncLocalStorage: asyncLocalStorage,
      enableCorrelationId: true,
    };

    options
      .bind<LoggerPort>(SharedCoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(config));

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

    //Grpc config
    options
      .bind(SharedConfigDITokens.GrpcCourseServiceConfig)
      .toConstantValue(GrpcCourseServiceConfig);
    options
      .bind(SharedConfigDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);
    options
      .bind(SharedConfigDITokens.RabbitMQConnectionConfig)
      .toConstantValue(new RabbitMQConfig());
    options
      .bind(SharedConfigDITokens.MongooseConnectionConfig)
      .toConstantValue(MongooseConnectionConfig);

    //External services
    options
      .bind<CourseServicePort>(SharedCoreDITokens.CourseService)
      .to(GrpcCourseServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(SharedCoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();

    //Redis Cache Client config
    options
      .bind(SharedConfigDITokens.RedisConfig)
      .toConstantValue(new RedisConfig());

    options
      .bind<CacheClientPort>(SharedInfrastructureDITokens.CacheClient)
      .to(RedisCacheClientAdapter)
      .inSingletonScope();
  },
);

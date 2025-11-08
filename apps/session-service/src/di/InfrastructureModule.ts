import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { MongooseUnitOfWork } from '@infrastructure/adapter/persistence/mongoose/uow/MongooseUnitOfWorkAdapter';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { CronServices } from '@infrastructure/cron/CronServices';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import { LiveKitMeetingServiceAdapter } from '@infrastructure/adapter/livekit/LiveKitMeeetingServiceAdapter';
import { LiveKitWebhookHandler } from '@infrastructure/adapter/livekit/LiveKitWebhookHandler';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { asyncLocalStorage } from '@shared/utils/async-store';
import { envVariables } from '@shared/env/envVariables';
import { SESSION_SERVICE } from '@shared/constants/services';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
import { MongooseConfig } from '@shared/config/MongooseConfig';
import type { CacheClientPort } from '@eduflux-v2/shared/ports/cache/CacheClientPort';
import { RedisCacheClientAdapter } from '@eduflux-v2/shared/adapters/cache/RedisCacheClientAdapter';
import { RedisConfig } from '@shared/config/RedisConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    const loggerConfig: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      asyncLocalStorage: asyncLocalStorage,
      serviceName: SESSION_SERVICE,
      enableCorrelationId: true,
    };
    options
      .bind<LoggerPort>(SharedCoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(loggerConfig));

    //Database connection
    options
      .bind<MongooseConnection>(SharedInfrastructureDITokens.MongooseConnection)
      .to(MongooseConnection)
      .inSingletonScope();

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
          queueNameFormatter: new RabbitMQqueueFormatter('session-service'),
          maxRetries: config.maxRetries,
        };

        return new RabbitMQMessageBrokerAdapter(params);
      })
      .inSingletonScope();

    //external services
    options
      .bind<UserServicePort>(SharedCoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
    options
      .bind<MeetingServicePort>(SessionDITokens.MeetingService)
      .to(LiveKitMeetingServiceAdapter);

    //Webhook handler
    options
      .bind<LiveKitWebhookHandler>(InfrastructureDITokens.LiveKitWebhookHandler)
      .to(LiveKitWebhookHandler);

    //Cron services
    options
      .bind<ICronServices>(InfrastructureDITokens.CronServices)
      .to(CronServices);

    //Configs
    options
      .bind(SharedConfigDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);
    options
      .bind(SharedConfigDITokens.MongooseConnectionConfig)
      .toConstantValue(MongooseConfig);
    options
      .bind(SharedConfigDITokens.RabbitMQConnectionConfig)
      .toConstantValue(new RabbitMQConfig());

    //Unit of work
    options
      .bind<UnitOfWork>(SharedCoreDITokens.UnitOfWork)
      .to(MongooseUnitOfWork);

    //Redis Cache Client
    options
      .bind(SharedConfigDITokens.RedisConfig)
      .toConstantValue(new RedisConfig());

    options
      .bind<CacheClientPort>(SharedInfrastructureDITokens.CacheClient)
      .to(RedisCacheClientAdapter)
      .inSingletonScope();
  },
);

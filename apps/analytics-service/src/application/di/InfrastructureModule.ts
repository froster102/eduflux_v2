import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { ANALYTICS_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/env/env-variables';
import { asyncLocalStorage } from '@shared/utils/async-store';
import { ContainerModule } from 'inversify';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { MongooseConfig } from '@shared/config/MongooseConfig';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { AnalyticsController } from '@analytics/controller/AnalyticsController';
import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Database connection
    options
      .bind<MongooseConnection>(SharedInfrastructureDITokens.MongooseConnection)
      .to(MongooseConnection)
      .inSingletonScope();

    //Logger
    const loggerConfig: LoggerConfig = {
      serviceName: ANALYTICS_SERVICE,
      environment: envVariables.NODE_ENV,
      asyncLocalStorage,
      enableCorrelationId: true,
    };
    options
      .bind<LoggerPort>(SharedCoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(loggerConfig));

    //Controller
    options
      .bind<AnalyticsController>(AnalyticsDITokens.AnalyticsController)
      .to(AnalyticsController);

    //RabbitMQ connection
    options
      .bind<RabbitMqConnection>(SharedInfrastructureDITokens.RabbitMQConnection)
      .to(RabbitMqConnection)
      .inSingletonScope();

    //Message Broker
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
          queueNameFormatter: new RabbitMQqueueFormatter('analytics-service'),
          maxRetries: config.maxRetries,
        };

        return new RabbitMQMessageBrokerAdapter(params);
      })
      .inSingletonScope();

    //config
    options
      .bind(SharedConfigDITokens.RabbitMQConnectionConfig)
      .toConstantValue(new RabbitMQConfig());
    options
      .bind(SharedConfigDITokens.MongooseConnectionConfig)
      .toConstantValue(MongooseConfig);
  },
);

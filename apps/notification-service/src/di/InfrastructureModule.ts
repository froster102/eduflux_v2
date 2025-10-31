import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import type { EmailServicePort } from '@core/application/notification/port/gateway/EmailServicePort';
import type { TemplateServicePort } from '@core/application/notification/port/gateway/TemplateServicePort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { NodeMailerEmailServiceAdapter } from '@infrastructure/adapter/email/NodeMailerEmailServiceAdapter';
import { GrpcCourseServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { HtmlTemplateServiceAdapter } from '@infrastructure/adapter/template/HtmlTemplateServiceAdapter';
import { ContainerModule } from 'inversify';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import { envVariables } from '@shared/env/envVariables';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { asyncLocalStorage } from '@shared/util/async-store';
import { NOTIFICATION_SERVICE } from '@shared/constants/services';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig copy';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { MongooseConnectionConfig } from '@shared/config/MongooseConfig';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    const loggerConfig: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: NOTIFICATION_SERVICE,
      asyncLocalStorage: asyncLocalStorage,
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
          queueNameFormatter: new RabbitMQqueueFormatter(
            'notification-service',
          ),
          maxRetries: config.maxRetries,
        };

        return new RabbitMQMessageBrokerAdapter(params);
      })
      .inSingletonScope();

    // Grpc config
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

    //external services
    options
      .bind<CourseServicePort>(SharedCoreDITokens.CourseService)
      .to(GrpcCourseServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(SharedCoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
    options
      .bind<EmailServicePort>(NotificationDITokens.EmailService)
      .to(NodeMailerEmailServiceAdapter)
      .inSingletonScope();
    options
      .bind<TemplateServicePort>(NotificationDITokens.TemplateService)
      .to(HtmlTemplateServiceAdapter)
      .inSingletonScope();
  },
);

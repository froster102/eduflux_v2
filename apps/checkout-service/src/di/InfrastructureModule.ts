import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import type { PaymentServicePort } from '@eduflux-v2/shared/ports/gateway/PaymentServicePort';
import type { SessionServicePort } from '@eduflux-v2/shared/ports/gateway/SessionServicePort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { GrpcCourseServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { GrpcSessionServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcSessionServiceAdapter';
import { GrpcPaymentServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcPaymentServiceAdapter';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { ContainerModule } from 'inversify';
import { envVariables } from '@shared/env/envVariables';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { asyncLocalStorage } from '@shared/util/async-store';
import { CHECKOUT_SERVICE } from '@shared/constants/services';
import { RabbitMQConfig } from '@shared/config/RabbitMQConfig';
import { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedConfigDITokens } from '@eduflux-v2/shared/di/SharedConfigDITokens';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQMessageBrokerAdapter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqMessageBrokerAdapter';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { GrpcSessionServiceConfig } from '@shared/config/GrpcSessionServiceConfig';
import { GrpcPaymentServiceConfig } from '@shared/config/GrpcPaymentServiceConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    const loggerConfig: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: CHECKOUT_SERVICE,
      asyncLocalStorage: asyncLocalStorage,
      enableCorrelationId: true,
    };
    options
      .bind<LoggerPort>(SharedCoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(loggerConfig));

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
          queueNameFormatter: new RabbitMQqueueFormatter('checkout-service'),
          maxRetries: config.maxRetries,
        };

        return new RabbitMQMessageBrokerAdapter(params);
      })
      .inSingletonScope();

    // Grpc configs
    options
      .bind(SharedConfigDITokens.GrpcCourseServiceConfig)
      .toConstantValue(GrpcCourseServiceConfig);
    options
      .bind(SharedConfigDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);
    options
      .bind(SharedConfigDITokens.GrpcSessionServiceConfig)
      .toConstantValue(GrpcSessionServiceConfig);
    options
      .bind(SharedConfigDITokens.GrpcPaymentServiceConfig)
      .toConstantValue(GrpcPaymentServiceConfig);
    options
      .bind(SharedConfigDITokens.RabbitMQConnectionConfig)
      .toConstantValue(new RabbitMQConfig());

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
      .bind<SessionServicePort>(SharedCoreDITokens.SessionService)
      .to(GrpcSessionServiceAdapter)
      .inSingletonScope();
    options
      .bind<PaymentServicePort>(SharedCoreDITokens.PaymentService)
      .to(GrpcPaymentServiceAdapter)
      .inSingletonScope();
  },
);

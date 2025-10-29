import { KafkaEventsConsumer } from '@api/consumers/KafkaEventsConsumer';
import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import type { EmailServicePort } from '@core/application/notification/port/gateway/EmailServicePort';
import type { TemplateServicePort } from '@core/application/notification/port/gateway/TemplateServicePort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { NodeMailerEmailServiceAdapter } from '@infrastructure/adapter/email/NodeMailerEmailServiceAdapter';
import { GrpcCourseServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { HtmlTemplateServiceAdapter } from '@infrastructure/adapter/template/HtmlTemplateServiceAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import { envVariables } from '@shared/env/envVariables';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { asyncLocalStorage } from '@shared/util/async-store';
import { NOTIFICATION_SERVICE } from '@shared/constants/services';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig copy';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';

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
      .bind<LoggerPort>(CoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(loggerConfig));

    //Kafka connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

    // Grpc config
    options
      .bind(CoreDITokens.GrpcCourseServiceConfig)
      .toConstantValue(GrpcCourseServiceConfig);
    options
      .bind(CoreDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);

    //external services
    options
      .bind<CourseServicePort>(CoreDITokens.CourseService)
      .to(GrpcCourseServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(CoreDITokens.UserService)
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

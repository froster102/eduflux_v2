import { KafkaEventsConsumer } from '@api/consumers/KafkaEventsConsumer';
import type { CourseServicePort } from '@core/application/notification/port/gateway/CourseServicePort';
import type { EmailServicePort } from '@core/application/notification/port/gateway/EmailServicePort';
import type { TemplateServicePort } from '@core/application/notification/port/gateway/TemplateServicePort';
import type { UserServicePort } from '@core/application/notification/port/gateway/UserServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { NodeMailerEmailServiceAdapter } from '@infrastructure/adapter/email/NodeMailerEmailServiceAdapter';
import { GrpcCourseServiceAdapter } from '@infrastructure/adapter/grpc/client/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@infrastructure/adapter/grpc/client/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@infrastructure/adapter/logger/WinstonLoggerAdapter';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { HtmlTemplateServiceAdapter } from '@infrastructure/adapter/template/HtmlTemplateServiceAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

    //Kafka connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

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
      .bind<EmailServicePort>(CoreDITokens.EmailService)
      .to(NodeMailerEmailServiceAdapter)
      .inSingletonScope();
    options
      .bind<TemplateServicePort>(CoreDITokens.TemplateService)
      .to(HtmlTemplateServiceAdapter)
      .inSingletonScope();
  },
);

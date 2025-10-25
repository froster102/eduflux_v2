import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { CourseServicePort } from '@core/common/gateway/EnrollmentServicePort';
import type { UserServicePort } from '@core/common/gateway/UserServicePort';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { GrpcCourseServiceAdapter } from '@infrastructure/adapter/grpc/GrpcCourseServiceAdapter';
import { GrpcUserServiceAdapter } from '@infrastructure/adapter/grpc/GrpcUserServiceAdapter';
import { KafkaConnection } from '@infrastructure/adapter/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/kafka/KafkaEventBusProducerAdapter';
import { WinstonLoggerAdapter } from '@infrastructure/adapter/logger/WinstonLoggerAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';

export const infrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

    //Kafka connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    //Kafka producer
    options
      .bind<EventBusPort>(CoreDITokens.EventBus)
      .to(KafkaEventBusProducerAdapter)
      .inSingletonScope();

    //Kafka consumer
    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

    //External services
    options
      .bind<CourseServicePort>(CoreDITokens.CourseService)
      .to(GrpcCourseServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(CoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
  },
);

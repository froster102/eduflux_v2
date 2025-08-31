import { KafkaEventsConsumer } from '@api/consumer/KafkaPaymentEventsConsumer';
import { GrpcCourseServiceAdapter } from '@api/grpc/client/GrpcCourseServiceAdapter';
import { GrpcPaymentServiceAdapter } from '@api/grpc/client/GrpcPaymentServiceAdapter';
import { GrpcUserServiceAdapter } from '@api/grpc/client/GrpcUserServiceAdapter';
import { GrpcEnrollmentServiceController } from '@api/grpc/services/GrpcEnrollmentServiceController';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CourseServicePort } from '@core/application/enrollment/port/gateway/CourseServicePort';
import type { PaymentServicePort } from '@core/application/enrollment/port/gateway/PaymentServicePort';
import type { UserServicePort } from '@core/application/enrollment/port/gateway/UserServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { WinstonLoggerAdapter } from '@infrastructure/adapter/logging/WinstonLoggerAdapter';
import { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/message/kafka/KafkaEventBusProducerAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';

export const InfrastructureModule = new ContainerModule((options) => {
  //Kafka connection
  options
    .bind<KafkaEventBusConnection>(
      InfrastructureDITokens.KafkaEventBusConnection,
    )
    .to(KafkaEventBusConnection)
    .inSingletonScope();

  //Kafka producer
  options
    .bind<EventBusPort>(CoreDITokens.EventBus)
    .to(KafkaEventBusProducerAdapter);

  //Consumers
  options
    .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
    .to(KafkaEventsConsumer);

  //Grpc controller
  options
    .bind<GrpcEnrollmentServiceController>(
      InfrastructureDITokens.GrpcEnrollmentServiceController,
    )
    .to(GrpcEnrollmentServiceController);

  //Logger
  options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

  //External Gateways
  options
    .bind<UserServicePort>(EnrollmentDITokens.UserService)
    .to(GrpcUserServiceAdapter)
    .inSingletonScope();
  options
    .bind<CourseServicePort>(EnrollmentDITokens.CourseService)
    .to(GrpcCourseServiceAdapter)
    .inSingletonScope();
  options
    .bind<PaymentServicePort>(EnrollmentDITokens.PaymentService)
    .to(GrpcPaymentServiceAdapter)
    .inSingletonScope();
});

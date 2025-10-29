import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { KafkaConnection } from '@infrastructure/adapter/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/kafka/KafkaEventBusProducerAdapter';
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

export const infrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    const config: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: CHAT_SERVICE,
      asyncLocalStorage: asyncLocalStorage,
      enableCorrelationId: true,
    };

    options
      .bind<LoggerPort>(CoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(config));

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

    //Grpc config
    options
      .bind(CoreDITokens.GrpcCourseServiceConfig)
      .toConstantValue(GrpcCourseServiceConfig);
    options
      .bind(CoreDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);

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

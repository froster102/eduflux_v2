import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { FileStorageGatewayPort } from '@core/application/course/port/gateway/FileStorageGatewayPort';
import { MongooseCategoryRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/category/MongooseCategoryRepositoryAdapter';
import { CloudinaryFileStorageAdapter } from '@infrastructure/adapter/storage/CloudinaryFileStorageAdapter';
import { ContainerModule } from 'inversify';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducer';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { envVariables } from '@shared/env/env-variables';
import { COURSE_SERVICE } from '@shared/constants/services';
import { AsyncLocalStorage } from 'node:async_hooks';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    const config: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      serviceName: COURSE_SERVICE,
      asyncLocalStorage: new AsyncLocalStorage<Map<string, string>>(),
      enableCorrelationId: true,
    };
    options
      .bind<LoggerPort>(CoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(config));

    // Repository
    options
      .bind<CategoryRepositoryPort>(CourseDITokens.CategoryRepository)
      .to(MongooseCategoryRepositoryAdapter);

    //Kafka consumer
    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    // Gateway bindings
    options
      .bind<UserServiceGatewayPort>(CourseDITokens.UserServiceGateway)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();

    options
      .bind<FileStorageGatewayPort>(CourseDITokens.FileStorageGateway)
      .to(CloudinaryFileStorageAdapter);
    options
      .bind<FileStorageGatewayPort>(AssetDITokens.FileStorageGateway)
      .to(CloudinaryFileStorageAdapter);

    //Grpc config
    options
      .bind(CoreDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);

    // Producer
    options
      .bind<EventBusPort>(CoreDITokens.EventBus)
      .to(KafkaEventBusProducerAdapter)
      .inSingletonScope();
  },
);

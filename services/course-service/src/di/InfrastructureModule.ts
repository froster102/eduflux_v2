import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { FileStorageGatewayPort } from '@core/application/course/port/gateway/FileStorageGatewayPort';
import { MongooseCategoryRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/category/MongooseCategoryRepositoryAdapter';
import { GrpcUserServiceAdapter } from '@infrastructure/adapter/grpc/client/GrpcUserServiceAdapter';
import { CloudinaryFileStorageAdapter } from '@infrastructure/adapter/storage/CloudinaryFileStorageAdapter';
import { ContainerModule } from 'inversify';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { WinstonLoggerAdapter } from '@infrastructure/logger/WinstonLoggerAdapter';
import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducer';
import type { EventBusPort } from '@core/common/port/message/EventBustPort';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

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

    // Producer
    options
      .bind<EventBusPort>(CoreDITokens.EventBus)
      .to(KafkaEventBusProducerAdapter)
      .inSingletonScope();
  },
);

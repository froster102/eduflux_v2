import { KafkaEventsConsumer } from 'src/api/consumers/KafkaEventsConsumer';
import { GrpcUserServiceController } from 'src/api/grpc/controller/GrpcUserServiceController';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/message/EventBustPort';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { KafkaConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/message/kafka/KafkaEventBusProducerAdapter';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { WinstonLogger } from '@infrastructure/logging/WinstonLoggerAdapter';
import { ContainerModule } from 'inversify';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLogger);

    //Controller
    options
      .bind<GrpcUserServiceController>(
        InfrastructureDITokens.GrpcUserServiceController,
      )
      .to(GrpcUserServiceController);

    //Kafka Connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    //Kafka Producer
    options
      .bind<EventBusPort>(CoreDITokens.EventBus)
      .to(KafkaEventBusProducerAdapter)
      .inSingletonScope();

    //Kafka Consumer
    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer);
  },
);

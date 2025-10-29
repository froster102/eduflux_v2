import { KafkaEventsConsumer } from 'src/api/consumers/KafkaEventsConsumer';
import { GrpcUserServiceController } from 'src/api/grpc/controller/GrpcUserServiceController';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
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

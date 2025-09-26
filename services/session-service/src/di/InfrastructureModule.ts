import type { PaymentServicePort } from '@core/application/session/port/gateway/PaymentServicePort';
import type { UserServicePort } from '@core/application/session/port/gateway/UserServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { GrpcPaymentServiceAdapter } from '@infrastructure/adapter/grpc/client/GrpcPaymentServiceAdapter';
import { GrpcUserServiceAdapter } from '@infrastructure/adapter/grpc/client/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@infrastructure/adapter/logger/WinstonLoggerAdapter';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';
import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import type { UnitOfWork } from '@core/common/unit-of-work/UnitOfWork';
import { MongooseUnitOfWork } from '@infrastructure/unit-of-work/MongooseUnitOfWork';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { CronServices } from '@infrastructure/cron/CronServices';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducerAdapter';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

    //Kafka connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    //Kafka consumer
    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

    //Kafka producer
    options
      .bind<KafkaEventBusProducerAdapter>(CoreDITokens.EventBus)
      .to(KafkaEventBusProducerAdapter)
      .inSingletonScope();

    //external services
    options
      .bind<PaymentServicePort>(CoreDITokens.PaymentService)
      .to(GrpcPaymentServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(CoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();

    //Cron services
    options
      .bind<ICronServices>(InfrastructureDITokens.CronServices)
      .to(CronServices);

    //Unit of work
    options.bind<UnitOfWork>(CoreDITokens.UnitOfWork).to(MongooseUnitOfWork);
  },
);

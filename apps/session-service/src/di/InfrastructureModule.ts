import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import { KafkaConnection } from '@infrastructure/adapter/messaging/kafka/KafkaConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { ContainerModule } from 'inversify';
import { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { MongooseUnitOfWork } from '@infrastructure/adapter/persistence/mongoose/uow/MongooseUnitOfWorkAdapter';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { CronServices } from '@infrastructure/cron/CronServices';
import { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducerAdapter';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import { LiveKitMeetingServiceAdapter } from '@infrastructure/adapter/livekit/LiveKitMeeetingServiceAdapter';
import { LiveKitWebhookHandler } from '@infrastructure/adapter/livekit/LiveKitWebhookHandler';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { asyncLocalStorage } from '@shared/utils/async-store';
import { envVariables } from '@shared/env/envVariables';
import { SESSION_SERVICE } from '@shared/constants/services';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    const loggerConfig: LoggerConfig = {
      environment: envVariables.NODE_ENV,
      asyncLocalStorage: asyncLocalStorage,
      serviceName: SESSION_SERVICE,
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
      .bind<UserServicePort>(CoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
    options
      .bind<MeetingServicePort>(SessionDITokens.MeetingService)
      .to(LiveKitMeetingServiceAdapter);

    //Webhook handler
    options
      .bind<LiveKitWebhookHandler>(InfrastructureDITokens.LiveKitWebhookHandler)
      .to(LiveKitWebhookHandler);

    //Cron services
    options
      .bind<ICronServices>(InfrastructureDITokens.CronServices)
      .to(CronServices);

    //Grpc config
    options
      .bind(CoreDITokens.GrpcUserServiceConfig)
      .toConstantValue(GrpcUserServiceConfig);

    //Unit of work
    options.bind<UnitOfWork>(CoreDITokens.UnitOfWork).to(MongooseUnitOfWork);
  },
);

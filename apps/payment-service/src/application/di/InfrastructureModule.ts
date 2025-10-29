import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { PaymentController } from '@payment/controller/PaymentController';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import { PAYMENT_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/env/env-variables';
import { asyncLocalStorage } from '@shared/utils/async-store';
import { ContainerModule } from 'inversify';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import { GrpcCourseServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcCourseServiceAdapter';
import type { SessionServicePort } from '@eduflux-v2/shared/ports/gateway/SessionServicePort';
import { GrpcSessionServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcSessionServiceAdapter';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';
import { GrpcSessionServiceConfig } from '@shared/config/GrpcSessionServiceConfig';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    const loggerConfig = {
      serviceName: PAYMENT_SERVICE,
      environment: envVariables.NODE_ENV,
      asyncLocalStorage,
    };
    options
      .bind<LoggerPort>(CoreDITokens.Logger)
      .toConstantValue(new WinstonLoggerAdapter(loggerConfig));

    //Controller
    options
      .bind<PaymentController>(PaymentDITokens.PaymentController)
      .to(PaymentController);

    // //Kafka Connection
    // options
    //   .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
    //   .to(KafkaConnection)
    //   .inSingletonScope();

    // //Kafka Producer
    // options
    //   .bind<EventBusPort>(CoreDITokens.EventBus)
    //   .to(KafkaEventBusProducerAdapter)
    //   .inSingletonScope();

    // //Kafka Consumer
    // options
    //   .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
    //   .to(KafkaEventsConsumer);

    //Grpc config

    options
      .bind(CoreDITokens.GrpcCourseServiceConfig)
      .toConstantValue(GrpcCourseServiceConfig);
    options
      .bind(CoreDITokens.GrpcSessionServiceConfig)
      .toConstantValue(GrpcSessionServiceConfig);

    //external service
    options
      .bind<CourseServicePort>(PaymentDITokens.CourseService)
      .to(GrpcCourseServiceAdapter)
      .inSingletonScope();
    options
      .bind<SessionServicePort>(PaymentDITokens.SessionService)
      .to(GrpcSessionServiceAdapter)
      .inSingletonScope();
  },
);

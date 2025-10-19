import { GrpcCourseService } from '@application/api/grpc/client/GrpcCourseService';
import { GrpcSessionService } from '@application/api/grpc/client/GrpcSessionService';
import { WinstonLogger } from '@infrastructure/logging/WinstonLoggerAdapter';
import { PaymentController } from '@payment/controller/PaymentController';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { ICourseService } from '@payment/interface/ICourseService';
import type { ISessionService } from '@payment/interface/ISessionService';
import { CoreDITokens } from '@shared/common/di/CoreDITokens';
import type { LoggerPort } from '@shared/common/port/logger/LoggerPort';
import { ContainerModule } from 'inversify';

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //Logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLogger);

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

    //external service
    options
      .bind<ICourseService>(PaymentDITokens.CourseService)
      .to(GrpcCourseService)
      .inSingletonScope();
    options
      .bind<ISessionService>(PaymentDITokens.SessionService)
      .to(GrpcSessionService)
      .inSingletonScope();
  },
);

import { KafkaEventsConsumer } from "@api/consumers/KafkaEventsConsumer";
import type { CourseServicePort } from "@core/application/notification/port/gateway/CourseServicePort";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { GrpcCourseServiceAdapter } from "@infrastructure/adapter/grpc/client/GrpcCourseServiceAdapter";
import { WinstonLoggerAdapter } from "@infrastructure/adapter/logger/WinstonLoggerAdapter";
import { KafkaConnection } from "@infrastructure/adapter/messaging/kafka/KafkaConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { ContainerModule } from "inversify";

export const InfrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    //logger
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

    //Kafka connection
    options
      .bind<KafkaConnection>(InfrastructureDITokens.KafkaConnection)
      .to(KafkaConnection)
      .inSingletonScope();

    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

    //external services
    options
      .bind<CourseServicePort>(CoreDITokens.CourseService)
      .to(GrpcCourseServiceAdapter);
  },
);

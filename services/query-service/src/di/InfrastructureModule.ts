import { KafkaEventsConsumer } from "@api/consumers/KafkaEventsConsumer";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { UserServicePort } from "@core/common/port/gateway/UserServicePort";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { GrpcUserServiceAdapter } from "@infrastructure/adapter/grpc/GrpcUserServiceAdapter";
import { KafkaConnection } from "@infrastructure/adapter/kakfa/KafkaConnection";
import { WinstonLoggerAdapter } from "@infrastructure/adapter/logger/WinstonLoggerAdapter";
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

    //Kafka consumer
    options
      .bind<KafkaEventsConsumer>(InfrastructureDITokens.KafkaEventsConsumer)
      .to(KafkaEventsConsumer)
      .inSingletonScope();

    //external services
    options
      .bind<UserServicePort>(CoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
  },
);

import { ChatResolver } from "@api/graphql/resolver/ChatResolver";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { EnrollmentServicePort } from "@core/common/gateway/EnrollmentServicePort";
import type { UserServicePort } from "@core/common/gateway/UserServicePort";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { GrpcEnrollmentServiceAdapter } from "@infrastructure/adapter/grpc/GrpcEnrollmentServiceAdapter";
import { GrpcUserServiceAdapter } from "@infrastructure/adapter/grpc/GrpcUserServiceAdapter";
import { WinstonLoggerAdapter } from "@infrastructure/adapter/logger/WinstonLoggerAdapter";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { ContainerModule } from "inversify";

export const infrastructureModule: ContainerModule = new ContainerModule(
  (options) => {
    options.bind<LoggerPort>(CoreDITokens.Logger).to(WinstonLoggerAdapter);

    //graphql resolvers
    options
      .bind<ChatResolver>(InfrastructureDITokens.ChatResolver)
      .to(ChatResolver);

    //External services
    options
      .bind<EnrollmentServicePort>(CoreDITokens.EnrollmentService)
      .to(GrpcEnrollmentServiceAdapter)
      .inSingletonScope();
    options
      .bind<UserServicePort>(CoreDITokens.UserService)
      .to(GrpcUserServiceAdapter)
      .inSingletonScope();
  },
);

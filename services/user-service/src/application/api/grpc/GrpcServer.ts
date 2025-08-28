import { Server, ServerCredentials } from '@grpc/grpc-js';
import { UserServiceService } from 'src/application/api/grpc/generated/user';
import { createServerLoggingInterceptor } from 'src/application/api/grpc/interceptors/createServerLoggingInterceptor';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { GrpcServerConfig } from '@infrastructure/config/GrpcServerConfig';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { GrpcUserServiceController } from '@application/api/grpc/controller/GrpcUserServiceController';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { container } from '@application/di/RootModule';

export class GrpcServer {
  private readonly port = GrpcServerConfig.PORT;

  private server: Server;
  private logger: LoggerPort;

  constructor() {
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext('GRPC_SERVER');
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
  }

  private registerServices(): void {
    const userService = container.get<GrpcUserServiceController>(
      InfrastructureDITokens.GrpcUserServiceController,
    );
    this.server.addService(UserServiceService, userService);
  }

  public start(): void {
    this.server.bindAsync(
      `0.0.0.0:${this.port}`,
      ServerCredentials.createInsecure(),
      (error: Error | null, port: number) => {
        if (error) {
          console.error(`Failed to bind server: ${error.message}`);
          return;
        }
        this.logger.info(`gRPC server running on port ${port}`);
        this.registerServices();
      },
    );
  }
}

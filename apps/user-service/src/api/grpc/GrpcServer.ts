import { Server, ServerCredentials } from '@grpc/grpc-js';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { GrpcServerConfig } from '@infrastructure/config/GrpcServerConfig';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { GrpcUserServiceController } from 'src/api/grpc/controller/GrpcUserServiceController';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { container } from '@di/RootModule';
import { createServerLoggingInterceptor } from '@eduflux-v2/shared/adapters/grpc/interceptors/serverLoggingInterceptor';
import { UserServiceService } from '@eduflux-v2/shared/adapters/grpc/generated/user';

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

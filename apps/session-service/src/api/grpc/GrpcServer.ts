import { Server, ServerCredentials } from '@grpc/grpc-js';
import { container } from '@di/RootModule';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { createServerLoggingInterceptor } from '@api/grpc/interceptors/createServerLoggingInterceptor';
import type { GrpcSessionServiceController } from '@api/grpc/controller/GrpcSessionServiceController';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { SessionServiceService } from '@api/grpc/generated/session';

export class GrpcServer {
  private readonly port: number;

  private server: Server;
  private logger: LoggerPort;

  constructor(port: number) {
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
      .fromContext(GrpcServer.name);
    this.port = port;
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
  }

  private registerServices(): void {
    const sessionService = container.get<GrpcSessionServiceController>(
      InfrastructureDITokens.GrpcSessionServiceController,
    );
    this.server.addService(SessionServiceService, sessionService);
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

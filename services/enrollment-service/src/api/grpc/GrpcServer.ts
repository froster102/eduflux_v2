import { EnrollmentServiceService } from '@api/grpc/generated/enrollment';
import type { GrpcEnrollmentServiceController } from '@api/grpc/services/GrpcEnrollmentServiceController';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';

export class GrpcServer {
  private logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('GRPC_SERVER');
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server();
    this.port = Number(GrpcServerConfig.PORT);
  }

  public registerServices(): void {
    const enrollmentService = container.get<GrpcEnrollmentServiceController>(
      InfrastructureDITokens.GrpcEnrollmentServiceController,
    );
    this.server.addService(EnrollmentServiceService, enrollmentService);
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

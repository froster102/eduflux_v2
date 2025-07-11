import { injectable } from 'inversify';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { container } from '@/shared/di/container';
import { Logger } from '@/shared/utils/logger';
import { TYPES } from '@/shared/di/types';
import { grpcServerConfig } from '@/shared/config/server.grpc.config';
import { GrpcEnrollmentService } from './services/enrollment.grpc.service';
import { EnrollmentServiceService } from './generated/enrollment';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';

@injectable()
export class GrpcServer {
  private logger = new Logger(ENROLLMENT_SERVICE);
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server();
    this.port = Number(grpcServerConfig.PORT);
  }

  public registerServices(): void {
    const enrollmentService = container.get<GrpcEnrollmentService>(
      TYPES.GrpcEnrollmentService,
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

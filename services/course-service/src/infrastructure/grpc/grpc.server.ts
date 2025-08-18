import { injectable } from 'inversify';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import { GrpcCourseService } from './services/course.grpc.service';
import { grpcServerConfig } from '@/shared/config/server.grpc.config';
import { CourseServiceService } from './generated/course';
import type { ILogger } from '@/shared/common/interfaces/logger.interface';
import { createServerLoggingInterceptor } from './interceptors/server-logging.interceptor';

@injectable()
export class GrpcServer {
  private logger = container.get<ILogger>(TYPES.Logger).fromContext('GRPC');
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
    this.port = Number(grpcServerConfig.PORT);
  }

  public registerServices(): void {
    const courseService = container.get<GrpcCourseService>(
      TYPES.GrpcCourseService,
    );
    this.server.addService(CourseServiceService, courseService);
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
        this.logger.info(`gRPC server listening on port ${port}`);
        this.registerServices();
      },
    );
  }
}

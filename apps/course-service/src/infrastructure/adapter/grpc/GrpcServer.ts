import type { GrpcCourseServiceController } from '@api/grpc/controller/GrpcCourseServiceController';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { CourseServiceService } from '@infrastructure/adapter/grpc/generated/course';
import { createServerLoggingInterceptor } from '@infrastructure/adapter/grpc/interceptors/serverLoggingInterceptor';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';

export class GrpcServer {
  private logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext(GrpcServer.name);
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
    this.port = GrpcServerConfig.GRPC_SERVER_PORT;
  }

  public registerServices(): void {
    const courseService = container.get<GrpcCourseServiceController>(
      CourseDITokens.GrpcCourseServiceController,
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

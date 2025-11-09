import type { GrpcCourseServiceController } from '@api/grpc/controller/GrpcCourseServiceController';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import { CourseServiceService } from '@eduflux-v2/shared/adapters/grpc/generated/course';
import { createServerLoggingInterceptor } from '@eduflux-v2/shared/adapters/grpc/interceptors/serverLoggingInterceptor';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';

export class GrpcServer {
  private logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext(GrpcServer.name);
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
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

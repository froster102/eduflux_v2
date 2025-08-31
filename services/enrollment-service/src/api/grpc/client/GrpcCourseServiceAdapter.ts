import { CourseServiceClient } from '@api/grpc/generated/course';
import type { CourseServicePort } from '@core/application/enrollment/port/gateway/CourseServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';
import { inject } from 'inversify';

export class GrpcCourseServiceAdapter implements CourseServicePort {
  private client: CourseServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcCourseServiceAdapter.name);
    this.address = GrpcCourseServiceConfig.GRPC_COURSE_SERVICE_URL;
    this.client = new CourseServiceClient(
      this.address,
      credentials.createInsecure(),
    );
    this.logger.info(
      `gRPC course service client initialized, target:${this.address}`,
    );
  }

  getCourse(courseId: string): Promise<Course> {
    return new Promise((resolve, reject) => {
      this.client.getCourseDetails(
        { courseId },
        (error: ServiceError | null, response) => {
          if (error) {
            this.logger.error(`Error fetching course details ${error.message}`);
            reject(new Error(error.message));
          }
          if (response) {
            resolve({
              ...response,
              instructor: response.instructor!,
            });
          }
        },
      );
    });
  }
}

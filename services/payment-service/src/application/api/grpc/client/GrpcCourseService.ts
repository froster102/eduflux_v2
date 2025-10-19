import { credentials, type ServiceError } from '@grpc/grpc-js';
import { CoreDITokens } from '@shared/common/di/CoreDITokens';
import type { LoggerPort } from '@shared/common/port/logger/LoggerPort';
import { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';
import type { Course } from '@shared/types/Course';
import { inject } from 'inversify';
import type { ICourseService } from '@payment/interface/ICourseService';
import { CourseServiceClient } from '@application/api/grpc/generated/course';
import type { Enrollment } from '@shared/types/Enrollment';

export class GrpcCourseService implements ICourseService {
  private client: CourseServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcCourseService.name);
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
              _class: 'course',
              ...response,
              instructor: response.instructor!,
            });
          }
        },
      );
    });
  }

  getEnrollment(enrollmentId: string): Promise<Enrollment> {
    return new Promise((resolve, reject) => {
      this.client.getEnrollment(
        { enrollmentId },
        (error: ServiceError | null, response) => {
          if (error) {
            this.logger.error(
              `Error fetching enrollment details ${error.message}`,
            );
            reject(new Error(error.message));
          }
          if (response) {
            resolve({ _class: 'enrollment', ...response });
          }
        },
      );
    });
  }
}

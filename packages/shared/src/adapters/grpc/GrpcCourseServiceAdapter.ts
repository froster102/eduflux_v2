import { credentials, type ServiceError } from '@grpc/grpc-js';
import type { CourseServicePort } from '@shared/ports/gateway/CourseServicePort';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import {
  CourseServiceClient,
  VerifyChatAccessResponse,
  type VerifyChatAccessRequest,
} from '@shared/adapters/grpc/generated/course';
import { createClientLoggingInterceptor } from '@shared/adapters/grpc/interceptors/clientLoggingInterceptor';
import { CoreDITokens } from '@shared/di/CoreDITokens';
import { inject } from 'inversify';
import type { Course } from '@shared/types/course';
import type { Enrollment } from '@shared/types/enrollment';
import type { GrpcCourseServiceConfig } from '@shared/config/GrpcCourseServiceConfig';

export class GrpcCourseServiceAdapter implements CourseServicePort {
  private client: CourseServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(CoreDITokens.GrpcCourseServiceConfig)
    private readonly config: GrpcCourseServiceConfig,
  ) {
    this.logger = logger.fromContext(GrpcCourseServiceAdapter.name);
    this.address = this.config.GRPC_COURSE_SERVICE_URL;
    this.client = new CourseServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC user service client initialized, target:${this.address}`,
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
            } as Course);
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
            resolve({
              _class: 'enrollment',
              id: response.id,
              courseId: response.courseId,
              learnerId: response.learnerId,
              instructorId: response.instructorId,
              status: response.status,
              paymentId: response.paymentId || null,
              createdAt: new Date(response.createdAt),
              updatedAt: new Date(response.updatedAt),
            } as Enrollment);
          }
        },
      );
    });
  }

  async verifyChatAccess(
    instructorId: string,
    learnerId: string,
  ): Promise<{ hasAccess: boolean }> {
    const request: VerifyChatAccessRequest = {
      instructorId,
      learnerId,
    };

    return new Promise((resolve, reject) => {
      this.client.verifyChatAccess(
        request,
        (
          error: ServiceError | null,
          response: VerifyChatAccessResponse | null,
        ) => {
          if (error) {
            this.logger.error(`Error fetching user details ${error.message}`);
            reject(new Error(error.message));
          }
          if (response) {
            resolve(response);
          }
        },
      );
    });
  }
}

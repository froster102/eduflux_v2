import { Logger } from '@/shared/utils/logger';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { injectable } from 'inversify';
import { ICourseServiceGateway } from '@/application/ports/course-service.gateway';
import { CourseServiceClient, Course } from '../generated/course';
import { courseGrpcServiceConfig } from '@/shared/config/course-service.grpc.config';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';

@injectable()
export class GrpcCourseServiceClient implements ICourseServiceGateway {
  private client: CourseServiceClient;
  private address: string;
  private logger = new Logger(ENROLLMENT_SERVICE);

  constructor() {
    this.address = courseGrpcServiceConfig.GRPC_COURSE_SERVICE_URL;
    this.client = new CourseServiceClient(
      this.address,
      credentials.createInsecure(),
    );
    this.logger.info(
      `gRPC course service client initialized, target:${this.address}`,
    );
  }

  getCourseDetails(courseId: string): Promise<Course> {
    return new Promise((resolve, reject) => {
      this.client.getCourseDetails(
        { courseId },
        (error: ServiceError | null, response: Course | null) => {
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

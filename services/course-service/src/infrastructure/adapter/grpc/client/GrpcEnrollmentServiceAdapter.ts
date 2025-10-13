import type { EnrollmentServiceGatewayPort } from '@core/application/course/port/gateway/EnrollmentServiceGatewayPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import {
  EnrollmentServiceClient,
  type CheckUserEnrollmentResponse,
} from '@infrastructure/adapter/grpc/generated/enrollment';
import { createClientLoggingInterceptor } from '@infrastructure/adapter/grpc/interceptors/clientLoggingInterceptor';
import { GrpcEnrollmentServiceConfig } from '@shared/config/GrpcEnrollmentServiceConfig';
import { inject } from 'inversify';

export class GrpcEnrollmentServiceAdapter
  implements EnrollmentServiceGatewayPort
{
  private client: EnrollmentServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcEnrollmentServiceAdapter.name);
    this.address = GrpcEnrollmentServiceConfig.GRPC_ENROLLMENT_SERVICE_URL;
    this.client = new EnrollmentServiceClient(
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
  // getUserSubscribedCourses(userId: string): Promise<string[]> {
  //   throw new Error('Method not implemented.');
  // }
  checkUserEnrollment(
    userId: string,
    courseId: string,
  ): Promise<{ isEnrolled: boolean }> {
    return new Promise((resolve, reject) =>
      this.client.checkUserEnrollment(
        { userId, courseId },
        (error: ServiceError | null, response: CheckUserEnrollmentResponse) => {
          if (error) {
            // this.logger.error(
            //   `Error fetching user enrollment details ${error.message}`,
            // );
            reject(new Error(error.message));
          }
          if (response) {
            resolve(response);
          }
        },
      ),
    );
  }
}

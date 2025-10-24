import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { CourseServicePort } from "@core/common/gateway/EnrollmentServicePort";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { credentials, type ServiceError } from "@grpc/grpc-js";
import {
  CourseServiceClient,
  VerifyChatAccessRequest,
  VerifyChatAccessResponse,
} from "@infrastructure/adapter/grpc/generated/course";
import { createClientLoggingInterceptor } from "@infrastructure/adapter/grpc/interceptors/client-logging.interceptor";
import { GrpcCourseServiceConfig } from "@shared/config/GrpcCourseServiceConfig";
import { inject } from "inversify";

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
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC user service client initialized, target:${this.address}`,
    );
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

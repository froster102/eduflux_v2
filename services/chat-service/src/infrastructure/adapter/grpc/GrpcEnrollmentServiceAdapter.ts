import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { EnrollmentServicePort } from "@core/common/gateway/EnrollmentServicePort";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { credentials, type ServiceError } from "@grpc/grpc-js";
import {
  EnrollmentServiceClient,
  VerifyChatAccessRequest,
  VerifyChatAccessResponse,
} from "@infrastructure/adapter/grpc/generated/enrollment";
import { createClientLoggingInterceptor } from "@infrastructure/adapter/grpc/interceptors/client-logging.interceptor";
import { GrpcEnrollmentServiceConfig } from "@shared/config/GrpcEnrollmentServiceConfig";
import { inject } from "inversify";

export class GrpcEnrollmentServiceAdapter implements EnrollmentServicePort {
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

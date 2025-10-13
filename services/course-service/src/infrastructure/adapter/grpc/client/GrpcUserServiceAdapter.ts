import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import {
  GetUserRequest,
  UserResponse,
  UserServiceClient,
} from '@infrastructure/adapter/grpc/generated/user';
import { createClientLoggingInterceptor } from '@infrastructure/adapter/grpc/interceptors/clientLoggingInterceptor';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { inject } from 'inversify';

export class GrpcUserServiceAdapter implements UserServiceGatewayPort {
  private client: UserServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcUserServiceAdapter.name);
    this.address = GrpcUserServiceConfig.GRPC_USER_SERVICE_URL;
    this.client = new UserServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC user service client created, target:${this.address}`,
    );
  }
  async getUserDetails(userId: string): Promise<UserProfile> {
    const request: GetUserRequest = { userId };
    return new Promise((resolve, reject) => {
      this.client.getUser(
        request,
        (error: ServiceError | null, response: UserResponse | null) => {
          if (error) {
            this.logger.error(
              `Error fetching user details: ${error.message}, code: ${error.code}, details: ${error.details}`,
            );
            reject(new Error(error.message));
            return;
          }
          if (response) {
            resolve(response);
          }
        },
      );
    });
  }
}

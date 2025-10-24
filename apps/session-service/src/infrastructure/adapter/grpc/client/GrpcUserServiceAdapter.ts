import type { UserServicePort } from '@core/application/session/port/gateway/UserServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { Role } from '@core/common/enums/Role';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import {
  GetUserRequest,
  UserResponse,
  UserServiceClient,
} from '@infrastructure/adapter/grpc/generated/user';
import { createClientLoggingInterceptor } from '@infrastructure/adapter/grpc/interceptors/client-logging.interceptor';
import { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';
import { inject } from 'inversify';

export class GrpcUserServiceAdapter implements UserServicePort {
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
      { interceptors: [createClientLoggingInterceptor(this.logger)] },
    );
    this.logger.info(
      `gRPC user service client initialized, target:${this.address}`,
    );
  }

  getUserDetails(userId: string): Promise<User> {
    const request: GetUserRequest = { userId };

    return new Promise((resolve, reject) => {
      this.client.getUser(
        request,
        (error: ServiceError | null, response: UserResponse | null) => {
          if (error) {
            this.logger.error(`Error fetching user details ${error.message}`);
            reject(new Error(error.message));
          }
          if (response) {
            resolve({ ...response, roles: response.roles as Role[] });
          }
        },
      );
    });
  }
}

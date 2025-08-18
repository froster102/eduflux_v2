import { credentials, ServiceError } from '@grpc/grpc-js';
import { inject } from 'inversify';
import { userServiceGrpcConfig } from '@/shared/config/user-service.grpc.config';
import { TYPES } from '@/shared/di/types';
import { type ILogger } from '@/shared/common/interfaces/logger.interface';
import {
  GetUserRequest,
  UserResponse,
  UserServiceClient,
} from '../generated/user';
import { IUserServiceGateway } from '@/application/ports/user-service.gateway';
import { createClientLoggingInterceptor } from '../interceptors/client-logging.interceptor';

export class GrpcUserServiceClient implements IUserServiceGateway {
  private client: UserServiceClient;
  private address: string;

  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
    this.logger = logger.fromContext(GrpcUserServiceClient.name);
    this.address = userServiceGrpcConfig.GRPC_USER_SERVICE_URL;
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

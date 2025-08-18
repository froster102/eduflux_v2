import type { ILogger } from '@/shared/common/interface/logger.interface';
import type { IUserServiceGateway } from '@/application/ports/user-service.gateway';
import {
  GetUserRequest,
  UserResponse,
  UserServiceClient,
} from '../generated/user';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import { inject, injectable } from 'inversify';
import { userGrpcServiceConfig } from '@/shared/config/user-service.grpc.config';
import { Role } from '@/shared/constants/role';
import { TYPES } from '@/shared/di/types';
import { createClientLoggingInterceptor } from '../interceptors/client-logging.interceptor';

@injectable()
export class GrpcUserServiceClient implements IUserServiceGateway {
  private client: UserServiceClient;
  private address: string;

  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
    this.logger = logger.fromContext(GrpcUserServiceClient.name);
    this.address = userGrpcServiceConfig.GRPC_USER_SERVICE_URL;
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

import { credentials, type ServiceError } from '@grpc/grpc-js';
import type { Role } from '@shared/constants/Role';
import type { UserServicePort } from '@shared/ports/gateway/UserServicePort';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import type { UserResponse as User } from '@shared/adapters/grpc/generated/user';
import {
  GetUserRequest,
  UserResponse,
  UserServiceClient,
} from '@shared/adapters/grpc/generated/user';
import { CoreDITokens } from '@shared/di/CoreDITokens';
import { inject } from 'inversify';
import type { GrpcUserServiceConfig } from '@shared/config/GrpcUserServiceConfig';

export class GrpcUserServiceAdapter implements UserServicePort {
  private client: UserServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(CoreDITokens.GrpcUserServiceConfig)
    private readonly config: GrpcUserServiceConfig,
  ) {
    this.logger = logger.fromContext(GrpcUserServiceAdapter.name);
    this.address = this.config.GRPC_USER_SERVICE_URL;
    this.client = new UserServiceClient(
      this.address,
      credentials.createInsecure(),
    );
    this.logger.info(
      `gRPC user service client initialized, target:${this.address}`,
    );
  }

  getUser(userId: string): Promise<User> {
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

  createUser(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
  }): Promise<User> {
    const request = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roles: data.roles,
    };

    return new Promise((resolve, reject) => {
      this.client.createUser(
        request,
        (error: ServiceError | null, response: UserResponse | null) => {
          if (error) {
            this.logger.error(`Error creating user profile ${error.message}`);
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

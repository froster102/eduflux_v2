import type { IUserGrpcService } from '@/interfaces/user-service.grpc.interface';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserServiceClient,
} from '../generated/user';
import { Logger } from '@/shared/utils/logger';
import { userGrpcServiceConfig } from '@/shared/config/user-service.grpc.config';
import { credentials, type ServiceError } from '@grpc/grpc-js';

export class UserGrpcServiceClient implements IUserGrpcService {
  private client: UserServiceClient;
  private address: string;
  private logger = new Logger('GRPC_USER_SERVICE');

  constructor() {
    this.address = userGrpcServiceConfig.GRPC_USER_SERVICE_URL;
    this.client = new UserServiceClient(
      this.address,
      credentials.createInsecure(),
    );
    this.logger.info(
      `gRPC user service client initialized, target:${this.address}`,
    );
  }

  createUserProfile(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
  }): Promise<void> {
    const request: CreateUserRequest = {
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
            resolve();
          }
        },
      );
    });
  }

  updateUser(
    data: Partial<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      roles: Role[];
    }>,
  ): Promise<void> {
    const request: UpdateUserRequest = { ...data } as UpdateUserRequest;
    return new Promise((resolve, reject) => {
      this.client.updateUser(
        request,
        (error: ServiceError | null, response: UserResponse | null) => {
          if (error) {
            this.logger.error(`Error creating user profile ${error.message}`);
            reject(new Error(error.message));
          }
          if (response) {
            resolve();
          }
        },
      );
    });
  }
}

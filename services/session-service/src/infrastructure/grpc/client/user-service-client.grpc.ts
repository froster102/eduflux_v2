import type { ILogger } from '@/shared/common/interface/logger.interface';
import type {
  GetInstructorPricingOutputDto,
  IUserServiceGateway,
} from '@/application/ports/user-service.gateway';
import {
  GetInstructorSessingPricingRequest,
  GetUserRequest,
  InstructorSessionPricingResponse,
  UserResponse,
  UserServiceClient,
} from '../generated/user';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import { inject, injectable } from 'inversify';
import { userGrpcServiceConfig } from '@/shared/config/user-service.grpc.config';
import { Role } from '@/shared/constants/role';
import { TYPES } from '@/shared/di/types';

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

  getInstructorSessionPricng(
    userId: string,
  ): Promise<GetInstructorPricingOutputDto> {
    const request: GetInstructorSessingPricingRequest = { userId };

    return new Promise((resolve, reject) => {
      this.client.getInstructorSessingPricing(
        request,
        (
          error: ServiceError | null,
          response: InstructorSessionPricingResponse | null,
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

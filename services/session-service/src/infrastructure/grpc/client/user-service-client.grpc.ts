import {
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
import { Logger } from '@/shared/utils/logger';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { injectable } from 'inversify';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { userGrpcServiceConfig } from '@/shared/config/user-service.grpc.config';
import { Role } from '@/shared/constants/role';

@injectable()
export class GrpcUserServiceClient implements IUserServiceGateway {
  private client: UserServiceClient;
  private address: string;
  private logger = new Logger(SESSION_SERVICE);

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

import {
  GetUserDetailsRequest,
  UserResponse,
  UserServiceClient,
} from '../generated/user';
import { Logger } from '@/shared/utils/logger';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { injectable } from 'inversify';
import { IUserServiceGateway } from '@/application/ports/user-service.gateway';
import { userGrpcServiceConfig } from '@/shared/config/user-service.grpc.config';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';

@injectable()
export class GrpcUserServiceClient implements IUserServiceGateway {
  private client: UserServiceClient;
  private address: string;
  private logger = new Logger(ENROLLMENT_SERVICE);

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

  getUserDetails(userId: string): Promise<UserProfile> {
    const request: GetUserDetailsRequest = { userId };

    return new Promise((resolve, reject) => {
      this.client.getUserDetails(
        request,
        (error: ServiceError | null, response: UserResponse | null) => {
          if (error) {
            console.log(error);
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

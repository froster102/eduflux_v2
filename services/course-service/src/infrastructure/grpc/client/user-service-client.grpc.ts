import {
  credentials,
  Interceptor,
  RequesterBuilder,
  ServiceError,
  InterceptingCall,
  ListenerBuilder,
} from '@grpc/grpc-js';
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
        interceptors: [this.loggingInterceptor],
      },
    );
    this.logger.info(
      `gRPC user service client created, target:${this.address}`,
    );
  }

  loggingInterceptor: Interceptor = (options, nextCall) => {
    const next = nextCall(options);

    const requester = new RequesterBuilder()
      .withStart((metadata, listener, nextStart) => {
        this.logger.info(
          `Sending metadata: ${JSON.stringify(metadata.getMap())}`,
        );
        const customListener = new ListenerBuilder()
          .withOnReceiveMessage((message, nextMessage) => {
            this.logger.info(`Response received: ${JSON.stringify(message)}`);
            nextMessage(message);
          })
          .withOnReceiveStatus((status, nextStatus) => {
            this.logger.info(
              `Call completed with status: ${JSON.stringify(status)}`,
            );
            nextStatus(status);
          })
          .build();
        nextStart(metadata, customListener);
      })
      .withSendMessage((message, nextMessage) => {
        this.logger.info(`Request with message: ${JSON.stringify(message)}`);
        nextMessage(message);
      })
      .build();

    return new InterceptingCall(next, requester);
  };

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

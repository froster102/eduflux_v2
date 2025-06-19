import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { Logger } from '@/shared/utils/logger';
import {
  GetUserDetailsRequest,
  UserResponse,
  UserServiceServer,
} from '../generated/user';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { getGrpcStatusCode } from '@/shared/errors/error-code';

@injectable()
export class UserGrpcService implements UserServiceServer {
  private logger = new Logger('UserGrpcService');

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  getUserDetails(
    call: ServerUnaryCall<GetUserDetailsRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    this.logger.info(`Received request for userId: ${call.request.userId}`);
    this.getUserUseCase
      .execute(call.request.userId)
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          bio: user.bio,
          socialLinks: user.socialLinks,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
        callback(null, response);
      })
      .catch((error) => {
        this.logger.error(
          `Error processing request: ${(error as Record<string, any>).message}`,
        );
        if (
          error instanceof ApplicationException ||
          error instanceof DomainException
        ) {
          const serviceError = {
            name: 'UserServiceError',
            code: getGrpcStatusCode(error.code),
            message: error.message,
          };
          callback(serviceError, null);
        }
        const serviceError = {
          name: 'UserServiceError',
          code: status.INTERNAL,
          message: 'Failed to process request',
        };
        callback(serviceError, null);
      });
  }
}

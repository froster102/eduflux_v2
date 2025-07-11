import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { Logger } from '@/shared/utils/logger';
import {
  CreateUserProfileRequest,
  GetUserDetailsRequest,
  UserResponse,
  UserServiceServer,
} from '../generated/user';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { getGrpcStatusCode } from '@/shared/errors/error-code';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { CreateUserDto } from '@/application/dtos/create-user.dto';
import { Role } from '@/shared/types/role';

@injectable()
export class UserGrpcService implements UserServiceServer {
  private logger = new Logger('UserGrpcService');

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  createUserProfile(
    call: ServerUnaryCall<CreateUserProfileRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    this.logger.info(`Received request for userId: ${call.request.id}`);
    const createUserDto: CreateUserDto = {
      id: call.request.id,
      firstName: call.request.firstName,
      lastName: call.request.lastName,
      roles: call.request.roles as Role[],
    };
    this.createUserUseCase
      .execute(createUserDto)
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          imageUrl: user.imageUrl || '',
          bio: user.bio || '',
          socialLinks: user.socialLinks || [],
          createdAt: user.createdAt ? user.createdAt.toISOString() : '',
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
        };
        this.logger.info(
          `Successfully created user profile for id: ${call.request.id}`,
        );
        callback(null, response);
      })
      .catch((error: Error) => {
        this.logger.error(
          `Error processing createUserProfile request for id ${call.request.id}: ${error.message}`,
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
        } else {
          const serviceError = {
            name: 'UserServiceError',
            code: status.INTERNAL,
            message: 'Failed to process request to create user profile',
          };
          callback(serviceError, null);
        }
      });
  }

  getUserDetails(
    call: ServerUnaryCall<GetUserDetailsRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    this.logger.info(`Received request for userID: ${call.request.userId}`);
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
          roles: user.roles,
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

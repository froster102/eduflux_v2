import {
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  UserResponse,
  type UserServiceServer,
} from '@application/api/grpc/generated/user';
import { Role } from '@core/common/enums/Role';
import { Exception } from '@core/common/errors/Exception';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import type { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUseCase';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import {
  type sendUnaryData,
  type ServerUnaryCall,
  status,
} from '@grpc/grpc-js';
import { getGrpcStatusCode } from '@shared/errors/error-code';
import { inject } from 'inversify';

export class GrpcUserServiceController implements UserServiceServer {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(UserDITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  createUser(
    call: ServerUnaryCall<CreateUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    const createUserDto: CreateUserPort = {
      id: call.request.id,
      firstName: call.request.firstName,
      lastName: call.request.lastName,
      email: call.request.email,
      roles: call.request.roles as Role[],
    };
    this.createUserUseCase
      .execute(createUserDto)
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
          image: user.image || '',
          bio: user.bio || '',
          socialLinks: user.socialLinks || [],
          createdAt: user.createdAt ? user.createdAt.toISOString() : '',
          updatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  updateUser(
    call: ServerUnaryCall<UpdateUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ) {
    this.updateUserUseCase
      .execute({
        id: call.request.id,
        firstName: call.request.firstName,
        lastName: call.request.email,
        roles: call.request.roles as Role[],
      })
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image || '',
          email: user.email,
          bio: user.bio || '',
          socialLinks: user.socialLinks || [],
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          roles: user.roles,
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  getUser(
    call: ServerUnaryCall<GetUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    this.getUserUseCase
      .execute({ userId: call.request.userId })
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image!,
          email: user.email,
          bio: user.bio!,
          socialLinks: user.socialLinks || [],
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          roles: user.roles,
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  private handleError<T>(error: Error, callback: sendUnaryData<T>) {
    if (error instanceof Exception) {
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
  }
}

import type { IGetUserUseCase } from '@/application/use-cases/interface/get-user.interface';
import type {
  CreateUserInput,
  ICreateUserUseCase,
} from '@/application/use-cases/interface/create-user.interface';
import type { IUpdateUserUseCase } from '@/application/use-cases/interface/update-user.interface';
import type { IGetUserSessionPriceUseCase } from '@/application/use-cases/interface/get-user-session-price.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import {
  CreateUserRequest,
  GetInstructorSessingPricingRequest,
  GetUserRequest,
  InstructorSessionPricingResponse,
  UpdateUserRequest,
  UserResponse,
  UserServiceServer,
} from '../generated/user';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { getGrpcStatusCode } from '@/shared/errors/error-code';
import { Role } from '@/shared/types/role';

@injectable()
export class UserGrpcService implements UserServiceServer {
  private logger = new Logger('UserGrpcService');

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: IGetUserUseCase,
    @inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: ICreateUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: IUpdateUserUseCase,
    @inject(TYPES.GetUserSessionPriceUseCase)
    private readonly getUserSessionPriceUseCase: IGetUserSessionPriceUseCase,
  ) {}

  createUser(
    call: ServerUnaryCall<CreateUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): void {
    this.logger.info(`Received request for userId: ${call.request.id}`);
    const createUserDto: CreateUserInput = {
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
        this.logger.info(
          `Successfully created user profile for id: ${call.request.id}`,
        );
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
    this.logger.info(
      `Received request for user update USER_ID:${call.request.id}`,
    );
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
          image: user.image!,
          email: user.email,
          bio: user.bio!,
          socialLinks: user.socialLinks!,
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
    this.logger.info(`Received request for userID: ${call.request.userId}`);
    this.getUserUseCase
      .execute(call.request.userId)
      .then((user) => {
        const response: UserResponse = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image!,
          email: user.email,
          bio: user.bio!,
          socialLinks: user.socialLinks!,
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

  getInstructorSessingPricing(
    call: ServerUnaryCall<
      GetInstructorSessingPricingRequest,
      InstructorSessionPricingResponse
    >,
    callback: sendUnaryData<InstructorSessionPricingResponse>,
  ) {
    this.logger.info(`Received request for userID: ${call.request.userId}`);
    this.getUserSessionPriceUseCase
      .execute({ userId: call.request.userId })
      .then((getUserSessionPriceOutput) => {
        if (getUserSessionPriceOutput) {
          const response: InstructorSessionPricingResponse = {
            id: getUserSessionPriceOutput.id,
            price: getUserSessionPriceOutput.price,
            currency: getUserSessionPriceOutput.currency,
            duration: getUserSessionPriceOutput.duration,
          };
          callback(null, response);
        }
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  private handleError<T>(
    error: Error | ApplicationException | DomainException,
    callback: sendUnaryData<T>,
  ) {
    this.logger.error(`Error processing request: ${error.message}`);
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
  }
}

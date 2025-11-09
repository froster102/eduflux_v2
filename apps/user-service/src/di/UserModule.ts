import { UserController } from 'src/api/http/controller/UserController';
import { UserDITokens } from '@application/user/di/UserDITokens';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import { CreateUserService } from '@application/user/service/CreateUserService';
import { GetUsersService } from '@application/user/service/GetUsersService';
import { GetUserService } from '@application/user/service/GetUserService';
import { UpdateUserService } from '@application/user/service/UpdateUserService';
import { BecomeInstructorService } from '@application/user/service/BecomeInstructorService';
import { MongooseUserRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/user/MongooseUserRepositoryAdapter';
import { ContainerModule } from 'inversify';
import type { CreateUserUseCase } from '@application/user/usecase/CreateUserUseCase';
import type { GetUsersUseCase } from '@application/user/usecase/GetUsersUseCase';
import type { GetUserUseCase } from '@application/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@application/user/usecase/UpdateUserUseCase';
import type { BecomeInstructorUseCase } from '@application/user/usecase/BecomeInstructorUseCase';

export const UserModule: ContainerModule = new ContainerModule((options) => {
  options
    .bind<CreateUserUseCase>(UserDITokens.CreateUserUseCase)
    .to(CreateUserService);
  options
    .bind<GetUsersUseCase>(UserDITokens.GetUsersUseCase)
    .to(GetUsersService);
  options.bind<GetUserUseCase>(UserDITokens.GetUserUseCase).to(GetUserService);
  options
    .bind<UpdateUserUseCase>(UserDITokens.UpdateUserUseCase)
    .to(UpdateUserService);
  options
    .bind<BecomeInstructorUseCase>(UserDITokens.BecomeInstructorUseCase)
    .to(BecomeInstructorService);
  options
    .bind<UserRepositoryPort>(UserDITokens.UserRepository)
    .to(MongooseUserRepositoryAdapter);
  options.bind<UserController>(UserDITokens.UserController).to(UserController);
});

import { UserController } from 'src/api/http/controller/UserController';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUseCase';
import type { GetUsersUseCase } from '@core/domain/user/usecase/GetUsersUseCase';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import { CreateUserService } from '@core/service/user/CreateUserService';
import { GetUsersService } from '@core/service/user/GetUsersService';
import { GetUserService } from '@core/service/user/GetUserService';
import { UpdateUserService } from '@core/service/user/UpdateUserService';
import { MongooseUserRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/user/MongooseUserRepositoryAdapter';
import { ContainerModule } from 'inversify';

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
    .bind<UserRepositoryPort>(UserDITokens.UserRepository)
    .to(MongooseUserRepositoryAdapter);
  options.bind<UserController>(UserDITokens.UserController).to(UserController);
});

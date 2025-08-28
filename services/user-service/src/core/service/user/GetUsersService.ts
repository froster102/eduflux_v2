import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { GetUsersPort } from '@core/domain/user/port/usecase/GetUsersPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';
import type { GetUsersUseCase } from '@core/domain/user/usecase/GetUsersUseCase';
import { inject } from 'inversify';

export class GetUsersService implements GetUsersUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(payload: GetUsersPort): Promise<UserDto[]> {
    const users = await this.userRepository.findByIds(payload.userIds);
    return UserDto.fromEntities(users);
  }
}

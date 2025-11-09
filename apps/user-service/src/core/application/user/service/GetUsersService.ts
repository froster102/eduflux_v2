import { UserDITokens } from '@application/user/di/UserDITokens';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { GetUsersPort } from '@application/user/port/usecase/GetUsersPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { GetUsersUseCase } from '@application/user/usecase/GetUsersUseCase';
import { inject } from 'inversify';

export class GetUsersService implements GetUsersUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(payload: GetUsersPort): Promise<UserUseCaseDto[]> {
    const users = await this.userRepository.findByIds(payload.userIds);
    return UserUseCaseDto.fromEntities(users);
  }
}

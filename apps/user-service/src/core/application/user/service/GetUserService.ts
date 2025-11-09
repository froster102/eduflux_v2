import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { UserDITokens } from '@application/user/di/UserDITokens';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { GetUserPort } from '@application/user/port/usecase/GetUserPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { GetUserUseCase } from '@application/user/usecase/GetUserUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';

export class GetUserService implements GetUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(payload: GetUserPort): Promise<UserUseCaseDto> {
    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(payload.userId),
      new NotFoundException('User not found.'),
    );
    return UserUseCaseDto.fromEntity(user);
  }
}

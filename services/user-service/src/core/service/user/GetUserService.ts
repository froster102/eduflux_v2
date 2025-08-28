import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';

export class GetUserService implements GetUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(payload: GetUserPort): Promise<UserDto> {
    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(payload.userId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'User not found.',
      }),
    );
    return UserDto.fromEntity(user);
  }
}

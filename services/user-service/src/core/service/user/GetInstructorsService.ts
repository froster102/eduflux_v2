import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { InstructorQueryResults } from '@core/domain/user/port/persistence/type/UserQueryParameter';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { GetInstructorsPort } from '@core/domain/user/port/usecase/GetInstructorsPort';
import type { GetInstructorsUseCase } from '@core/domain/user/usecase/GetInstructorsUseCase';
import { inject } from 'inversify';

export class GetInstructorsService implements GetInstructorsUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private userRepository: UserRepositoryPort,
  ) {}

  async execute(payload: GetInstructorsPort): Promise<InstructorQueryResults> {
    const { queryParameters, currentUserId } = payload;

    const result = await this.userRepository.findInstructors(
      currentUserId,
      queryParameters,
    );

    return result;
  }
}

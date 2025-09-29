import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { GetInstructorsPort } from '@core/domain/user/port/usecase/GetInstructorsPort';
import type { GetInstructorsUseCase } from '@core/domain/instructor/usecase/GetInstructorsUseCase';
import { inject } from 'inversify';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';
import { Role } from '@core/common/enums/Role';
import { InstructorUserCaseDto } from '@core/domain/instructor/usecase/dto/InstructorUseCaseDto';
import type { GetInstructorsUseCaseResult } from '@core/domain/instructor/usecase/types/GetInstructorsUseCaseResult';

export class GetInstructorsService implements GetInstructorsUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
  ) {}

  async execute(
    payload: GetInstructorsPort,
  ): Promise<GetInstructorsUseCaseResult> {
    const { queryParameters, currentUserId } = payload;

    const { users, totalCount } = await this.userRepository.findUsers(
      { ...queryParameters, roles: [Role.INSTRUCTOR] },
      currentUserId,
    );

    const instructorIds = users.map((user) => user.getId());

    const instructors =
      await this.instructorRepository.findByIds(instructorIds);

    return {
      instructors: InstructorUserCaseDto.fromUsers(users, instructors),
      totalCount,
    };
  }
}

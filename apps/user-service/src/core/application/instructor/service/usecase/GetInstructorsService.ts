import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { UserDITokens } from '@application/user/di/UserDITokens';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { GetInstructorsPort } from '@application/user/port/usecase/GetInstructorsPort';
import { inject } from 'inversify';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { Role } from '@eduflux-v2/shared/constants/Role';
import type { GetInstructorsUseCase } from '@application/instructor/usecase/GetInstructorsUseCase';
import type { GetInstructorsUseCaseResult } from '@application/instructor/usecase/types/GetInstructorsUseCaseResult';
import { InstructorUserCaseDto } from '@application/instructor/usecase/dto/InstructorUseCaseDto';

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

    const instructorIds = users.map((user) => user.id);

    const instructors =
      await this.instructorRepository.findByIds(instructorIds);

    return {
      instructors: InstructorUserCaseDto.fromUsers(users, instructors),
      totalCount,
    };
  }
}

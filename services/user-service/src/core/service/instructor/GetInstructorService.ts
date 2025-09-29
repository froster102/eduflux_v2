import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { inject } from 'inversify';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorUserCaseDto } from '@core/domain/instructor/usecase/dto/InstructorUseCaseDto';
import { Role } from '@core/common/enums/Role';
import type { GetInstructorUseCase } from '@core/domain/instructor/usecase/GetInstructorUseCase';
import type { GetInstructorPort } from '@core/domain/instructor/usecase/types/GetInstructorPort';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';

export class GetInstructorService implements GetInstructorUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
  ) {}

  async execute(payload: GetInstructorPort): Promise<InstructorUserCaseDto> {
    const { instructorId } = payload;

    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(instructorId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'User not found.',
      }),
    );

    CoreAssert.isTrue(
      user.getRoles().includes(Role.INSTRUCTOR),
      Exception.new({ code: Code.ACCESS_DENIED_ERROR }),
    );

    const instructor = CoreAssert.notEmpty(
      await this.instructorRepository.findById(instructorId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'User not found.',
      }),
    );

    return InstructorUserCaseDto.fromUser(user, instructor);
  }
}

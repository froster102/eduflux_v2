import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { inject } from 'inversify';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import { Role } from '@core/common/enums/Role';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import type { GetInstructorPort } from '@core/application/instructor/usecase/types/GetInstructorPort';
import type { GetInstructorUseCase } from '@core/application/instructor/usecase/GetInstructorUseCase';
import { InstructorUserCaseDto } from '@core/application/instructor/usecase/dto/InstructorUseCaseDto';

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

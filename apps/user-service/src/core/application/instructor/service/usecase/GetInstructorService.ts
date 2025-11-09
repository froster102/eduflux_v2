import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { UserDITokens } from '@application/user/di/UserDITokens';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import { inject } from 'inversify';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import type { GetInstructorPort } from '@application/instructor/usecase/types/GetInstructorPort';
import type { GetInstructorUseCase } from '@application/instructor/usecase/GetInstructorUseCase';
import { InstructorUserCaseDto } from '@application/instructor/usecase/dto/InstructorUseCaseDto';

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
      new NotFoundException('User not found.'),
    );

    CoreAssert.isTrue(
      user.getRoles().includes(Role.INSTRUCTOR),
      new ForbiddenException(),
    );

    const instructor = CoreAssert.notEmpty(
      await this.instructorRepository.findById(instructorId),
      new NotFoundException('User not found.'),
    );

    return InstructorUserCaseDto.fromUser(user, instructor);
  }
}

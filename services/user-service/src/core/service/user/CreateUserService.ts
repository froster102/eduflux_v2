import { Role } from '@core/common/enums/Role';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import { Instructor } from '@core/domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import type { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import type { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUseCase';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';
import { inject } from 'inversify';

export class CreateUserService implements CreateUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
  ) {}

  async execute(payload: CreateUserPort): Promise<UserDto> {
    const { email, firstName, id, lastName, roles, bio, socialLinks } = payload;
    const user = await this.userRepository.findById(id);

    if (user) {
      throw Exception.new({
        code: Code.ENTITY_ALREADY_EXISTS_ERROR,
        overrideMessage: `User  already exists.`,
      });
    }

    const newUser = User.new({
      id,
      firstName,
      lastName,
      email,
      roles,
      bio,
      socialLinks,
    });

    //perform transaction!!
    if (newUser.getRoles().includes(Role.INSTRUCTOR)) {
      const newInstructor = Instructor.new({
        id: newUser.getId(),
        isSessionEnabled: false,
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
      });
      await this.instructorRepository.save(newInstructor);
    }

    await this.userRepository.save(newUser);

    return UserDto.fromEntity(newUser);
  }
}

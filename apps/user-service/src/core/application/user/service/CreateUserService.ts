import { Role } from '@eduflux-v2/shared/constants/Role';
import { ConflictException } from '@eduflux-v2/shared/exceptions/ConflictException';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { Instructor } from '@domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import { LearnerStats } from '@core/domain/learner-stats/entity/LearnerStats';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { UserDITokens } from '@application/user/di/UserDITokens';
import { User } from '@domain/user/entity/User';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { CreateUserPort } from '@application/user/port/usecase/CreateUserPort';
import type { CreateUserUseCase } from '@application/user/usecase/CreateUserUseCase';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import { inject } from 'inversify';
import { UserCreatedEvent } from '@eduflux-v2/shared/events/user/UserCreatedEvent';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class CreateUserService implements CreateUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: CreateUserPort): Promise<UserUseCaseDto> {
    const { email, firstName, id, lastName, roles, bio, socialLinks } = payload;
    const user = await this.userRepository.findById(id);

    if (user) {
      throw new ConflictException('User already exists.');
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
    const learnerStats = LearnerStats.new({ id: newUser.id });

    //perform transaction!!
    if (newUser.getRoles().includes(Role.INSTRUCTOR)) {
      const newInstructor = Instructor.new({
        id: newUser.id,
        isSessionEnabled: false,
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
      });
      await this.instructorRepository.save(newInstructor);
    }

    await this.userRepository.save(newUser);
    await this.learnerStatsRepository.save(learnerStats);

    const userCreatedEvent = new UserCreatedEvent(newUser.id, {
      id: newUser.id,
      firstName: newUser.getFirstName(),
      lastName: newUser.getLastName(),
      email: newUser.getEmail(),
      roles: newUser.getRoles(),
    });
    await this.messageBroker.publish(userCreatedEvent);
    return UserUseCaseDto.fromEntity(newUser);
  }
}

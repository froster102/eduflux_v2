import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { Instructor } from '@domain/instructor/entity/Instructor';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { UserDITokens } from '@application/user/di/UserDITokens';
import { InstructorCreatedEvent } from '@application/views/instructor-view/events/InstructorCreatedEvent';
import { UserEvents } from '@domain/user/events/UserEvents';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { UpdateUserPort } from '@application/user/port/usecase/UpdateUserPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { UpdateUserUseCase } from '@application/user/usecase/UpdateUserUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: UpdateUserPort): Promise<UserUseCaseDto> {
    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(payload.id),
      new NotFoundException(),
    );

    if (
      payload.roles &&
      payload.roles.includes(Role.INSTRUCTOR) &&
      !user.getRoles().includes(Role.INSTRUCTOR)
    ) {
      const newInstructor = Instructor.new({
        id: user.id,
        isSessionEnabled: false,
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
      });
      await this.instructorRepository.save(newInstructor);

      const instructorCreatedEvent = new InstructorCreatedEvent(newInstructor.id, {
        profile: {
          name: user.getFullName(),
          bio: user.getBio(),
          image: user.getImage(),
        },
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
      });

      await this.messageBroker.publish(instructorCreatedEvent);
    }

    user.update(payload);

    //perform transaction!!

    const updatedUser = await this.userRepository.update(payload.id, user);

    if (updatedUser) {
      const userUpdatedEvent = new UserUpdatedEvent(user.id, {
        id: user.id,
        image: user.getImage(),
        name: user.getFullName(),
        bio: user.getBio(),
      });
      await this.messageBroker.publish(userUpdatedEvent);
    }

    return UserUseCaseDto.fromEntity(user);
  }
}

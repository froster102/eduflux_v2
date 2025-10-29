import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { Instructor } from '@domain/instructor/entity/Instructor';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { UserDITokens } from '@application/user/di/UserDITokens';
import type { InstructorCreatedEvent } from '@domain/user/events/InstructorCreatedEvent';
import { UserEvents } from '@domain/user/events/UserEvents';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { UpdateUserPort } from '@application/user/port/usecase/UpdateUserPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { UpdateUserUseCase } from '@application/user/usecase/UpdateUserUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBusPort: EventBusPort,
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

      const instructorCreatedEvent: InstructorCreatedEvent = {
        id: newInstructor.id,
        type: InstructorEvents.INSTRUCTOR_CREATED,
        profile: {
          name: user.getFullName(),
          bio: user.getBio(),
          image: user.getImage(),
        },
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
        timestamp: new Date().toISOString(),
      };

      await this.eventBusPort.sendEvent(instructorCreatedEvent);
    }

    user.update(payload);

    //perform transaction!!

    const updatedUser = await this.userRepository.update(payload.id, user);

    if (updatedUser) {
      const userUpdatedEvent: UserUpdatedEvent = {
        id: user.id,
        type: UserEvents.USER_UPDATED,
        image: user.getImage(),
        name: user.getFullName(),
        bio: user.getBio(),
        timestamp: new Date().toISOString(),
        occuredAt: new Date().toISOString(),
      };
      await this.eventBusPort.sendEvent(userUpdatedEvent);
    }

    return UserUseCaseDto.fromEntity(user);
  }
}

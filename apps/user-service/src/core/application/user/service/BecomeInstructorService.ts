import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ConflictException } from '@eduflux-v2/shared/exceptions/ConflictException';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import { Instructor } from '@domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { UserDITokens } from '@application/user/di/UserDITokens';
import { InstructorCreatedEvent } from '@application/views/instructor-view/events/InstructorCreatedEvent';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import type { BecomeInstructorPort } from '@application/user/port/usecase/BecomeInstructorPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { BecomeInstructorUseCase } from '@application/user/usecase/BecomeInstructorUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class BecomeInstructorService implements BecomeInstructorUseCase {
  constructor(
    @inject(UserDITokens.UserRepository)
    private readonly userRepository: UserRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: BecomeInstructorPort): Promise<UserUseCaseDto> {
    const user = CoreAssert.notEmpty(
      await this.userRepository.findById(payload.userId),
      new NotFoundException(),
    );

    if (user.getRoles().includes(Role.INSTRUCTOR)) {
      throw new ConflictException('User is already an instructor.');
    }

    const errors: string[] = [];

    const userImage = user.getImage();
    if (!userImage || userImage.trim() === '') {
      errors.push('User should have a profile image.');
    }

    const bio = user.getBio();
    if (!bio || bio.trim() === '') {
      errors.push('User bio is required.');
    } else {
      const bioWords = bio
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const wordCount = bioWords.length;

      if (wordCount < 100) {
        errors.push('User bio should be of minimum 100 words.');
      }
      if (wordCount > 500) {
        errors.push('User bio should be of maximum 500 words.');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(JSON.stringify({ errors }));
    }

    const updatedRoles = [...user.getRoles(), Role.INSTRUCTOR];

    const newInstructor = Instructor.new({
      id: user.id,
      isSessionEnabled: false,
      sessionsConducted: 0,
      totalCourses: 0,
      totalLearners: 0,
    });
    await this.instructorRepository.save(newInstructor);

    const instructorCreatedEvent = new InstructorCreatedEvent(
      newInstructor.id,
      {
        profile: {
          name: user.getFullName(),
          bio: user.getBio(),
          image: user.getImage(),
        },
        sessionsConducted: 0,
        totalCourses: 0,
        totalLearners: 0,
      },
    );

    await this.messageBroker.publish(instructorCreatedEvent);

    user.update({ roles: updatedRoles });
    const updatedUser = await this.userRepository.update(payload.userId, user);

    if (updatedUser) {
      // Emit UserUpdatedEvent with roles
      const userUpdatedEvent = new UserUpdatedEvent(user.id, {
        id: user.id,
        image: user.getImage(),
        name: user.getFullName(),
        bio: user.getBio(),
        roles: user.getRoles(),
      });

      await this.messageBroker.publish(userUpdatedEvent);
    }

    return UserUseCaseDto.fromEntity(user);
  }
}

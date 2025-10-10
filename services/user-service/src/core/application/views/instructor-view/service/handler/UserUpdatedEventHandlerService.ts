import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { UserUpdatedEventHandler } from '@core/application/views/instructor-view/handler/UserUpdatedEventHandler';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import type { UserUpdatedEvent } from '@core/domain/user/events/UserUpdatedEvent';
import { inject } from 'inversify';

export class UserUpdatedEventHandlerService implements UserUpdatedEventHandler {
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event;

    const payload = {
      name,
      image,
      bio,
    };

    await this.instructorViewRepository.updateUser(userId, payload);
  }
}

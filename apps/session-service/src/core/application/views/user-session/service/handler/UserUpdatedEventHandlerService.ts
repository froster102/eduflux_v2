import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserUpdatedEvent } from '@core/application/views/user-session/events/UserUpdatedEvent';
import type { UserUpdatedEventHandler } from '@core/application/views/user-session/handler/UserUpdatedEventHandler';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { inject } from 'inversify';

export class UserUpdatedEventHandlerService implements UserUpdatedEventHandler {
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event;

    const payload = {
      name,
      image,
      bio,
    };

    await this.userSessionRepository.updateUser(userId, payload);
  }
}

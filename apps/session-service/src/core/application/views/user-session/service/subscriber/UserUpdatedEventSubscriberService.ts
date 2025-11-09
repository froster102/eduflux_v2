import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserUpdatedEventSubscriber';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';
import { inject } from 'inversify';

export class UserUpdatedEventSubscriberService
  implements UserUpdatedEventSubscriber
{
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async on(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event.payload;

    const payload = {
      name,
      image,
      bio,
    };

    await this.userSessionRepository.updateUser(userId, payload);
  }

  subscribedTo() {
    return [UserUpdatedEvent];
  }
}

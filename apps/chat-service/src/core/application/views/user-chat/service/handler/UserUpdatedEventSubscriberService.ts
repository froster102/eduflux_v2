import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserUpdatedEventSubscriber';
import type { UserChatRepositoryPort } from '@core/application/views/user-chat/port/persistence/UserChatRepositoryPort';
import { inject } from 'inversify';
import { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export class UserUpdatedEventSubscriberService
  implements UserUpdatedEventSubscriber
{
  constructor(
    @inject(UserChatDITokens.UserChatRepository)
    private readonly userSessionRepository: UserChatRepositoryPort,
  ) {}

  async on(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event.payload;
    const payload = { name, image, bio };
    await this.userSessionRepository.updateUser(userId, payload);
  }

  subscribedTo() {
    return [UserUpdatedEvent];
  }
}

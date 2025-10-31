import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserChatCreatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserChatCreatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserUpdatedEventSubscriber';
import type { Container } from 'inversify';

export class ChatServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): ChatServiceEventSubscribers {
    const userChatCreated = container.get<UserChatCreatedEventSubscriber>(
      UserChatDITokens.UserChatCreatedEventSubscriber,
    );
    const userUpdated = container.get<UserUpdatedEventSubscriber>(
      UserChatDITokens.UserUpdatedEventSubscriber,
    );
    return new ChatServiceEventSubscribers([userChatCreated, userUpdated]);
  }
}

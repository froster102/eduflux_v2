import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { UserChatCreatedEvent } from '@core/application/views/user-chat/events/UserChatCreatedEvent';

export interface UserChatCreatedEventSubscriber
  extends EventSubscriberPort<UserChatCreatedEvent> {}

import type { UserChatCreatedEvent } from '@core/application/views/user-chat/events/UserChatCreatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface UserChatCreatedEventHandler
  extends EventHandler<UserChatCreatedEvent, void> {}

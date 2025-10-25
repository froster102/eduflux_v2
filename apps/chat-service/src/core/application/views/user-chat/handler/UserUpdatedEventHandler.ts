import type { EventHandler } from '@core/common/events/EventHandler';
import type { UserUpdatedEvent } from '@core/application/views/user-chat/events/UserUpdatedEvent';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}

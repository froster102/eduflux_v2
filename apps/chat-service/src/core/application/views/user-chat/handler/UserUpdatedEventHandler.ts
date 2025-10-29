import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { UserUpdatedEvent } from '@core/application/views/user-chat/events/UserUpdatedEvent';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}

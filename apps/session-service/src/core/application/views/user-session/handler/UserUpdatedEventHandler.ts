import type { UserUpdatedEvent } from '@core/application/views/user-session/events/UserUpdatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}

import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}

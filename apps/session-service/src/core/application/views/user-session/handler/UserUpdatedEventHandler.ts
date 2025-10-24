import type { UserUpdatedEvent } from '@core/application/views/user-session/events/UserUpdatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}

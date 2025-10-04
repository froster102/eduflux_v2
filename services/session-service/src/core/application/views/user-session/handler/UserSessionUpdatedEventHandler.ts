import type { UserSessionUpdatedEvent } from '@core/application/views/user-session/events/SessionUpdatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface UserSessionUpdatedEventHandler
  extends EventHandler<UserSessionUpdatedEvent, void> {}

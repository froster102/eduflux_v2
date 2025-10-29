import type { UserSessionUpdatedEvent } from '@core/application/views/user-session/events/SessionUpdatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

export interface UserSessionUpdatedEventHandler
  extends EventHandler<UserSessionUpdatedEvent | SessionCompletedEvent, void> {}

import type { UserSessionUpdatedEvent } from '@core/application/views/user-session/events/SessionUpdatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';
import type { SessionCompletedEvent } from '@core/domain/session/events/SessionCompletedEvent';

export interface UserSessionUpdatedEventHandler
  extends EventHandler<UserSessionUpdatedEvent | SessionCompletedEvent, void> {}

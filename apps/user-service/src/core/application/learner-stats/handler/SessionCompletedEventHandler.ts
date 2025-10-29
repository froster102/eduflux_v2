import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

export interface SessionCompletedEventHandler
  extends EventHandler<SessionCompletedEvent, void> {}

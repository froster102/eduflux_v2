import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

export interface SessionCompletedEventSubscriber
  extends EventSubscriberPort<SessionCompletedEvent> {}

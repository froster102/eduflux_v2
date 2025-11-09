import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import { SessionUpdatedEvent } from '@eduflux-v2/shared/events/session/SessionUpdatedEvent';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

export interface UserSessionUpdatedEventSubscriber
  extends EventSubscriberPort<SessionUpdatedEvent | SessionCompletedEvent> {}

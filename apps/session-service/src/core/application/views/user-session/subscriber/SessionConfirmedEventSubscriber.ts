import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';

export interface SessionConfirmedEventSubscriber
  extends EventSubscriberPort<SessionConfirmedEvent> {}



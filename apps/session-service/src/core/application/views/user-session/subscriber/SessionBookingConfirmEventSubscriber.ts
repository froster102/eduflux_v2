import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { SessionBookingConfirmEvent } from '@eduflux-v2/shared/events/session/SessionBookingConfirmEvent';

export interface SessionBookingConfirmEventSubscriber
  extends EventSubscriberPort<SessionBookingConfirmEvent> {}

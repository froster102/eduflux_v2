import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';

export interface EnrollmentCompletedEventSubscriber
  extends EventSubscriberPort<EnrollmentCompletedEvent> {}



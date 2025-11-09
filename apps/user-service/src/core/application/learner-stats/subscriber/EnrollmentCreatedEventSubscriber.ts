import type { EnrollmentCreatedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCreatedEvent';
import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';

export interface EnrollmentCreatedEventSubscriber
  extends EventSubscriberPort<EnrollmentCreatedEvent> {}

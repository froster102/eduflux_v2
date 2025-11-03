import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { InstructorCreatedEvent } from '@application/views/instructor-view/events/InstructorCreatedEvent';

export interface InstructorCreatedEventSubscriber
  extends EventSubscriberPort<InstructorCreatedEvent> {}

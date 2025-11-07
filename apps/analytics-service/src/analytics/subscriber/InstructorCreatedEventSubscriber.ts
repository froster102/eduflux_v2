import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';
import type { InstructorCreatedEvent } from '@eduflux-v2/shared/events/user/InstructorCreatedEvent';

export interface InstructorCreatedEventSubscriber
  extends EventSubscriberPort<InstructorCreatedEvent> {}

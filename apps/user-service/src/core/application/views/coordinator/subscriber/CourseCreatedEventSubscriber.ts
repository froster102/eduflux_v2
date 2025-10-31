import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import { CourseCreatedEvent } from '@eduflux-v2/shared/events/course/CourseCreatedEvent';

export interface CourseCreatedEventSubscriber
  extends EventSubscriberPort<CourseCreatedEvent> {}


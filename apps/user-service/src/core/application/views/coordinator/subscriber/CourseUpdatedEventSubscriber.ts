import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import { CourseUpdatedEvent } from '@eduflux-v2/shared/events/course/CourseUpdatedEvent';

export interface CourseUpdatedEventSubscriber
  extends EventSubscriberPort<CourseUpdatedEvent> {}

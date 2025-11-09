import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';
import type { CoursePublishedEvent } from '@eduflux-v2/shared/events/course/CoursePublishedEvent';

export interface CoursePublishedEventSubscriber
  extends EventSubscriberPort<CoursePublishedEvent> {}

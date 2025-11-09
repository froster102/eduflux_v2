import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import { CoursePublishedEvent } from '@eduflux-v2/shared/events/course/CoursePublishedEvent';

export interface CoursePublishedEventSubscriber
  extends EventSubscriberPort<CoursePublishedEvent> {}

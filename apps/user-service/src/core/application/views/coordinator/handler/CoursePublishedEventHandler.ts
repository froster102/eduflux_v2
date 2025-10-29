import type { CoursePublishedEvent } from '@application/views/coordinator/events/CoursePublishedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface CoursePublishedEventHandler
  extends EventHandler<CoursePublishedEvent, void> {}

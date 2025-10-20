import type { CoursePublishedEvent } from '@core/application/views/coordinator/events/CoursePublishedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface CoursePublishedEventHandler
  extends EventHandler<CoursePublishedEvent, void> {}

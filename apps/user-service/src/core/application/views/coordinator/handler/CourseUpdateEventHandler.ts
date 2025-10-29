import type { CourseUpdatedEvent } from '@application/views/coordinator/events/CourseUpdatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface CourseUpdatedEventHandler
  extends EventHandler<CourseUpdatedEvent, void> {}

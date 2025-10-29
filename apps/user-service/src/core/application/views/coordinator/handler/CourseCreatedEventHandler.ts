import type { CourseCreatedEvent } from '@application/views/coordinator/events/CourseCreatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface CourseCreatedEventHandler
  extends EventHandler<CourseCreatedEvent, void> {}

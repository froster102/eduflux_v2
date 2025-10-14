import type { CourseCreatedEvent } from '@core/application/views/coordinator/events/CourseCreatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface CourseCreatedEventHandler
  extends EventHandler<CourseCreatedEvent, void> {}

import type { CourseUpdatedEvent } from '@core/application/views/coordinator/events/CourseUpdatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface CourseUpdatedEventHandler
  extends EventHandler<CourseUpdatedEvent, void> {}

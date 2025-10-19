import type { CourseEvents } from '@core/common/events/enum/CourseEvents';
import type { Event } from '@core/common/events/Event';

export interface CoursePublishedEvent extends Event {
  readonly id: string;
  readonly type: CourseEvents.COURSE_PUBLISHED;
  readonly instructorId: string;
  readonly occurredAt: string;
}

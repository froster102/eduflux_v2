import type { CourseEvents } from '@shared/events/course/enum/CourseEvents';
import type { Event } from '@shared/events/Event';

export interface CoursePublishedEvent extends Event {
  readonly id: string;
  readonly type: CourseEvents.COURSE_PUBLISHED;
  readonly instructorId: string;
  readonly occurredAt: string;
}

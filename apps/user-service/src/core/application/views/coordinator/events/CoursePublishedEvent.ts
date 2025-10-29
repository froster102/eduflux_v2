import type { Event } from '@eduflux-v2/shared/events/Event';
import type { CourseEvents } from '@shared/constants/events';

export interface CoursePublishedEvent extends Event {
  readonly id: string;
  readonly type: CourseEvents.COURSE_PUBLISHED;
  readonly instructorId: string;
  readonly occurredAt: string;
}

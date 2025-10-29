import type { CourseEvents } from '@shared/events/course/enum/CourseEvents';
import type { Event } from '@shared/events/Event';

export interface CourseCreatedEvent extends Event {
  readonly type: CourseEvents.COURSE_CREATED;
  readonly instructorId: string;
  readonly courseMetadata: {
    readonly id: string;
    readonly title: string;
    readonly thumbnail: string | null;
    readonly status: string;
    readonly level: string | null;
    readonly enrollmentCount: number;
    readonly averageRating: number;
  };
}

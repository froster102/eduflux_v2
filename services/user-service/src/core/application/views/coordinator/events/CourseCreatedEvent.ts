import type { Event } from '@core/common/events/Event';
import type { CourseEvents } from '@shared/constants/events';

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
  occurredAt: string;
}

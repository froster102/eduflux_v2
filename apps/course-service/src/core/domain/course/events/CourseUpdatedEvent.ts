import type { CourseEvents } from '@core/common/events/enum/CourseEvents';

export interface CourseUpdatedEvent {
  readonly id: string;
  readonly type: CourseEvents.COURSE_UPDATED;
  readonly instructorId: string;
  readonly courseMetadata: {
    readonly id: string;
    readonly title?: string | null;
    readonly thumbnail?: string | null;
    readonly description?: string | null;
    readonly status: string;
    readonly level?: string | null;
    readonly enrollmentCount?: number;
    readonly averageRating?: number;
  };
  readonly occurredAt: string;
}

import { Event } from '@shared/events/Event';
import { CourseEvents } from '@shared/events/course/enum/CourseEvents';

export interface CourseUpdatedEventPayload {
  readonly id: string;
  readonly instructorId: string;
  readonly courseId: string;
  readonly title?: string | null;
  readonly thumbnail?: string | null;
  readonly description?: string | null;
  readonly status: string;
  readonly level?: string | null;
  readonly enrollmentCount?: number;
  readonly averageRating?: number;
}

export class CourseUpdatedEvent extends Event<CourseUpdatedEventPayload> {
  static readonly EVENT_NAME = CourseEvents.COURSE_UPDATED;

  constructor(id: string, payload: CourseUpdatedEventPayload) {
    super({ id, name: CourseEvents.COURSE_UPDATED }, payload);
  }
}

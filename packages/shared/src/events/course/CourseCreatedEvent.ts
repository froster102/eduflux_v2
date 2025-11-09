import { CourseEvents } from '@shared/events/course/enum/CourseEvents';
import { Event } from '@shared/events/Event';

export interface CourseCreatedEventPayload {
  readonly instructorId: string;
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string | null;
  readonly status: string;
  readonly level: string | null;
  readonly enrollmentCount: number;
  readonly averageRating: number;
}

export class CourseCreatedEvent extends Event<CourseCreatedEventPayload> {
  static readonly EVENT_NAME = CourseEvents.COURSE_CREATED;

  constructor(id: string, payload: CourseCreatedEventPayload) {
    super({ id, name: CourseEvents.COURSE_CREATED }, payload);
  }
}

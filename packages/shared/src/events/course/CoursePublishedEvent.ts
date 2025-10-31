import { Event } from '@shared/events/Event';
import { CourseEvents } from '@shared/events/course/enum/CourseEvents';

export interface CoursePublishedEventPayload {
  readonly id: string;
  readonly instructorId: string;
}

export class CoursePublishedEvent extends Event<CoursePublishedEventPayload> {
  static readonly EVENT_NAME = CourseEvents.COURSE_PUBLISHED;

  constructor(id: string, payload: CoursePublishedEventPayload) {
    super({ id, name: CourseEvents.COURSE_PUBLISHED }, payload);
  }
}

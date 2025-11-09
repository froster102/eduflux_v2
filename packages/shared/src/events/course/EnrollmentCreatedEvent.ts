import { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import { Event } from '@shared/events/Event';

export interface EnrollmentCreatedEventPayload {
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly instructor: {
    readonly id: string;
    readonly name: string;
  };
  readonly level: string;
  readonly averageRating: number;
  readonly enrolledAt: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly userId: string;
  readonly path: string;
}

export class EnrollmentCreatedEvent extends Event<EnrollmentCreatedEventPayload> {
  static readonly EVENT_NAME = EnrollmentEvents.ENROLLMENT_CREATED;

  constructor(id: string, payload: EnrollmentCreatedEventPayload) {
    super({ id, name: EnrollmentEvents.ENROLLMENT_CREATED }, payload);
  }
}

import type { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import type { Event } from '@shared/events/Event';

export interface EnrollmentCompletedEvent extends Event {
  readonly type: EnrollmentEvents.ENROLLMENT_COMPLETED;
  readonly courseId: string;
  readonly courseMetadata: {
    readonly title: string;
    readonly description: string;
    readonly thumbnail: string;
    readonly instructor: {
      readonly id: string;
      readonly name: string;
    };
    readonly level: string;
    readonly averageRating: number;
    readonly enrollmentCount: number;
  };
  readonly enrolledAt: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly userId: string;
  readonly path: string;
  readonly timestamp: string;
}

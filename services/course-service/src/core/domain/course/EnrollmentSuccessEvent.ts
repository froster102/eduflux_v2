import type { Event } from '@core/common/events/Event';
import type { EnrollmentEvents } from '@core/domain/course/events/enum/EnrollmentEvents';

export interface EnrollmentSuccessEvent extends Event {
  readonly type: EnrollmentEvents.ENROLLMENT_SUCESS;
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly instructor: {
    readonly id: string;
    readonly name: string;
  };
  readonly status: string;
  readonly enrolledAt: string;
  readonly level: string;
  readonly price: number | null;
  readonly isFree: boolean;
  readonly averageRating: number;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly occuredAt: string;
  readonly userId: string;
  readonly path: string;
}

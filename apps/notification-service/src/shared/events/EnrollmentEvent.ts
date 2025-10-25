import type { EnrollmentEvents } from '@core/common/events/enum/EnrollmentEvents';
import type { Event } from '@core/common/events/Event';

export interface EnrollmentSuccessEvent extends Event {
  readonly type: EnrollmentEvents.ENROLLMENT_SUCESS;
  readonly courseId: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly occuredAt: string;
  readonly userId: string;
  readonly path: string;
}

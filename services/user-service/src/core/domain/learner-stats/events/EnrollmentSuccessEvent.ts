import type { Event } from '@core/common/events/Event';
import type { EnrollmentEvents } from '@core/domain/learner-stats/events/enum/EnrollmentEvents';

export interface EnrollmentSuccessEvent extends Event {
  readonly type: EnrollmentEvents.ENROLLMENT_SUCESS;
  readonly courseId: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly occuredAt: string;
  readonly userId: string;
  readonly path: string;
}

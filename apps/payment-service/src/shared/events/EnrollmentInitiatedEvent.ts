import type { Event } from '@shared/common/events/Event';
import type { EnrollmentEvents } from '@shared/events/enum/EnrollmentEvents';

export interface EnrollmentInitiatedEvent extends Event {
  type: EnrollmentEvents.ENROLLMENT_INITIATED;
  enrollmentId: string;
  courseId: string;
  learnerId: string;
  instructorId: string;
  courseTitle: string;
  courseThumbnail: string;
  price: number;
  currency: 'USD';
}

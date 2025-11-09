import type { EnrollmentStatus } from '@shared/constants/EnrollmentStatus';

export interface Enrollment {
  _class: 'enrollment';
  id: string;
  courseId: string;
  learnerId: string;
  instructorId: string;
  status: EnrollmentStatus;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

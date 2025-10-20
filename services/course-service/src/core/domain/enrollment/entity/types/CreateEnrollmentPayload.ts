import type { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';

export type CreateEnrollmentPayload = {
  id: string;
  learnerId: string;
  courseId: string;
  status: EnrollmentStatus;
  instructorId: string;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

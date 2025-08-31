import type { EnrollmentStatus } from '@core/common/enums/EnrollmentStatus';

export type CreateEnrollmentPayload = {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  instructorId: string;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

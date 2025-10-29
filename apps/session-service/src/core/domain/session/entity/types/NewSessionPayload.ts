import type { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';

export type NewSessionPayload = {
  id: string;
  instructorId: string;
  learnerId: string;
  availabilitySlotId: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  paymentId: string | null;
  pendingPaymentExpiryTime: Date | null;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

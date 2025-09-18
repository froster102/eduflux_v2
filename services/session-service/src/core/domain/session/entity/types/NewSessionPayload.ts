import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

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

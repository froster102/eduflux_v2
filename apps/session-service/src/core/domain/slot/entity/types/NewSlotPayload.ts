import type { SlotStatus } from '@core/domain/slot/enum/SlotStatus';

export type NewSlotPayload = {
  id: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  bookedById: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

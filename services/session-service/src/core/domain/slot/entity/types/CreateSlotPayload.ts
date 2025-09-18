import type { NewSlotPayload } from '@core/domain/slot/entity/types/NewSlotPayload';

export type CreateSlotPayload = Omit<
  NewSlotPayload,
  'createdAt' | 'updatedAt' | 'status' | 'bookedById' | 'sessionId'
>;

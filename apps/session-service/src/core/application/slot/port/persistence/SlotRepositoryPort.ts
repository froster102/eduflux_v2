import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Slot } from '@core/domain/slot/entity/Slot';
import type { SlotStatus } from '@core/domain/slot/enum/SlotStatus';

export interface SlotRepositoryPort extends BaseRepositoryPort<Slot> {
  deleteAvailableOrBlockedByInstructorAndRange(
    instructorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void>;
  findBookedByInstructorAndRange(
    instructorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Slot[]>;
  findByInstructorId(
    instructorId: string,
    startOfDayUTC: Date,
    endOfDayUTC: Date,
  ): Promise<Slot[]>;
  updateAllSlotStatus(
    filter: {
      ids: string[];
    },
    newStatus: SlotStatus,
  ): Promise<void>;
}

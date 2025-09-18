import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Slot } from '@core/domain/slot/entity/Slot';

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
}

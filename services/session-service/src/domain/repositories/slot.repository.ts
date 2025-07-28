import { Slot } from '../entities/slot.entity';
import { IBaseRepository } from './base.repository';

export interface ISlotRepository extends IBaseRepository<Slot> {
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

import type { ClientSession } from 'mongoose';
import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type { IMongoSlot } from '../schema/slot.schema';
import { MongoBaseRepository } from './base.repository';
import { ISlotRepository } from '@/domain/repositories/slot.repository';
import { TYPES } from '@/shared/di/types';
import { Slot, SlotStatus } from '@/domain/entities/slot.entity';
import { inject, unmanaged } from 'inversify';
import { SlotModel } from '../models/slot.model';

export class MongoSlotRepository
  extends MongoBaseRepository<Slot, IMongoSlot>
  implements ISlotRepository
{
  constructor(
    @inject(TYPES.SlotMapper)
    private readonly slotMapper: IMapper<Slot, IMongoSlot>,
    @unmanaged() session?: ClientSession,
  ) {
    super(SlotModel, slotMapper, session);
  }

  async deleteAvailableOrBlockedByInstructorAndRange(
    instructorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await SlotModel.deleteMany(
      {
        instructorId: instructorId,
        startTime: { $gte: startDate },
        endTime: { $lte: endDate },
        status: {
          $in: [SlotStatus.AVAILABLE, SlotStatus.BLOCKED],
        },
      },
      { session: this.session },
    );
  }

  async findBookedByInstructorAndRange(
    instructorId: string,
    queryStartTime: Date,
    queryEndTime: Date,
  ): Promise<Slot[]> {
    const docs = await SlotModel.find({
      instructorId: instructorId,
      status: SlotStatus.BOOKED,
      startTime: { $lt: queryEndTime },
      endTime: { $gt: queryStartTime },
    });
    return docs ? this.slotMapper.toDomainArray(docs) : [];
  }
}

import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { Slot } from '@core/domain/slot/entity/Slot';
import { SlotStatus } from '@core/domain/slot/enum/SlotStatus';
import { MongooseSlotMapper } from '@infrastructure/adapter/persistence/mongoose/model/slot/mapper/MongooseSlotMapper';
import {
  SlotModel,
  type MongooseSlot,
} from '@infrastructure/adapter/persistence/mongoose/model/slot/MongooseSlot';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseSlotRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Slot, MongooseSlot>
  implements SlotRepositoryPort
{
  constructor(@unmanaged() session?: ClientSession) {
    super(SlotModel, MongooseSlotMapper, session);
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
    return docs ? MongooseSlotMapper.toDomainEntities(docs) : [];
  }

  async findByInstructorId(
    instructorId: string,
    startOfDayUTC: Date,
    endOfDayUTC: Date,
  ): Promise<Slot[]> {
    const docs = await SlotModel.find({
      instructorId,
      startTime: { $gte: startOfDayUTC },
      endTime: { $lte: endOfDayUTC },
    });

    return docs ? MongooseSlotMapper.toDomainEntities(docs) : [];
  }

  async updateAllSlotStatus(
    filter: { ids: string[] },
    newStatus: SlotStatus,
  ): Promise<void> {
    await SlotModel.updateMany(
      {
        _id: { $in: filter.ids },
      },
      { status: newStatus },
    );
  }
}

import { Slot } from '@/domain/entities/slot.entity';
import type { IMapper } from './mapper.interface';
import type { IMongoSlot } from '../database/schema/slot.schema';

export class SlotMapper implements IMapper<Slot, IMongoSlot> {
  toDomain(raw: IMongoSlot): Slot {
    return Slot.fromPersistence({
      id: raw._id,
      instructorId: raw.instructorId,
      startTime: raw.startTime,
      endTime: raw.endTime,
      status: raw.status,
      bookedById: raw.bookedById,
      sessionId: raw.sessionId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(slot: Slot): IMongoSlot {
    return {
      _id: slot.id,
      instructorId: slot.instructorId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.status,
      bookedById: slot.bookedById,
      sessionId: slot.sessionId,
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    } as IMongoSlot;
  }

  toDomainArray(raw: IMongoSlot[]): Slot[] {
    return raw.map((r) => this.toDomain(r));
  }
}

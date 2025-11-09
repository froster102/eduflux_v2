import { Slot } from '@core/domain/slot/entity/Slot';
import type { MongooseSlot } from '@infrastructure/adapter/persistence/mongoose/model/slot/MongooseSlot';

export class MongooseSlotMapper {
  static toDomain(raw: MongooseSlot): Slot {
    return Slot.new({
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

  static toPersistence(raw: Slot): Partial<MongooseSlot> {
    return {
      _id: raw.id,
      instructorId: raw.instructorId,
      startTime: raw.startTime,
      endTime: raw.endTime,
      status: raw.status,
      bookedById: raw.bookedById,
      sessionId: raw.sessionId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainEntities(raw: MongooseSlot[]): Slot[] {
    return raw.map((r) => this.toDomain(r));
  }
}

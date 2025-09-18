import { Session } from '@core/domain/session/entity/Session';
import type { MongooseSession } from '@infrastructure/adapter/persistence/mongoose/model/session/MongooseSession';

export class MongooseSessionMapper {
  static toDomain(raw: MongooseSession): Session {
    return Session.new({
      id: raw._id,
      instructorId: raw.instructorId,
      learnerId: raw.learnerId,
      availabilitySlotId: raw.availabilitySlotId,
      startTime: raw.startTime,
      endTime: raw.endTime,
      status: raw.status,
      paymentId: raw.paymentId,
      pendingPaymentExpiryTime: raw.pendingPaymentExpiryTime,
      price: raw.price,
      currency: raw.currency,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(raw: Session): Partial<MongooseSession> {
    return {
      _id: raw.id,
      instructorId: raw.instructorId,
      learnerId: raw.learnerId,
      availabilitySlotId: raw.availabilitySlotId,
      startTime: raw.startTime,
      endTime: raw.endTime,
      status: raw.status,
      paymentId: raw.paymentId,
      pendingPaymentExpiryTime: raw.pendingPaymentExpiryTime,
      price: raw.price,
      currency: raw.currency,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainEntities(raw: MongooseSession[]): Session[] {
    return raw.map((r) => this.toDomain(r));
  }
}

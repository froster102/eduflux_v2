import { IMapper } from './mapper.interface';
import { IMongoSession } from '../database/schema/session.schema';
import { Session } from '@/domain/entities/session.entity';

export class SessionMapper implements IMapper<Session, IMongoSession> {
  toDomain(raw: IMongoSession): Session {
    return Session.fromPersistence({
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

  toPersistence(raw: Session): IMongoSession {
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
    } as IMongoSession;
  }

  toDomainArray(raw: IMongoSession[]): Session[] {
    return raw.map((r) => this.toDomain(r));
  }
}

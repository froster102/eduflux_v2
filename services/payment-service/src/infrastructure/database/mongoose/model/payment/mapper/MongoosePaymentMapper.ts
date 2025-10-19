import type { MongoosePayment } from '@infrastructure/database/mongoose/model/MongoosePayment';
import { Payment } from '@payment/entity/Payment';

export class MongoosePaymentMapper {
  static toDomainEntity(document: MongoosePayment): Payment {
    return new Payment({
      id: document._id,
      userId: document.userId,
      instructorId: document.instructorId,
      idempotencyKey: document.idempotencyKey,
      type: document.type,
      referenceId: document.referenceId,
      totalAmount: document.totalAmount,
      platformFee: document.platformFee,
      instructorRevenue: document.instructorRevenue,
      currency: document.currency,
      gatewayTransactionId: document.gatewayTransactionId,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static toMongooseEntity(entity: Payment): Partial<MongoosePayment> {
    return {
      _id: entity.id,
      userId: entity.userId,
      instructorId: entity.instructorId,
      idempotencyKey: entity.idempotencyKey,
      type: entity.type,
      referenceId: entity.referenceId,
      totalAmount: entity.totalAmount,
      platformFee: entity.platformFee,
      instructorRevenue: entity.instructorRevenue,
      currency: entity.currency,
      gatewayTransactionId: entity.gatewayTransactionId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomainEntities(documents: MongoosePayment[]): Payment[] {
    return documents.map((doc) => this.toDomainEntity(doc));
  }
}

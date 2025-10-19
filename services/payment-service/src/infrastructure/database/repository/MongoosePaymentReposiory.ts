import {
  PaymentModel,
  type MongoosePayment,
} from '@infrastructure/database/mongoose/model/MongoosePayment';
import { MongoosePaymentMapper } from '@infrastructure/database/mongoose/model/payment/mapper/MongoosePaymentMapper';
import { MongooseBaseRepository } from '@infrastructure/database/repository/base/MongooseBaseRepository';
import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { Payment } from '@payment/entity/Payment';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import type { FindExistingPaymentQuery } from '@payment/repository/types/FindExistingPaymentQuery';

export class MongoosePaymentRepository
  extends MongooseBaseRepository<Payment, MongoosePayment>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel, MongoosePaymentMapper);
  }

  async findExistingPayment(
    query: FindExistingPaymentQuery,
  ): Promise<Payment | null> {
    const document = await PaymentModel.findOne({
      userId: query.userId,
      referenceId: query.referenceId,
      type: query.paymentType,
    }).lean();

    return document ? MongoosePaymentMapper.toDomainEntity(document) : null;
  }

  async findByTransactionId(id: string): Promise<Payment> {
    const document = await PaymentModel.findOne({
      gatewayTransactionId: id,
    }).lean();

    if (!document) {
      throw new Error(`Payment with transaction id "${id}" not found`);
    }

    return MongoosePaymentMapper.toDomainEntity(document);
  }

  async delete(id: string): Promise<void> {
    await PaymentModel.deleteOne({ _id: id });
  }

  async updateStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<void> {
    const update: Partial<MongoosePayment> = {
      status,
      updatedAt: new Date(),
    };

    if (transactionId) {
      update.gatewayTransactionId = transactionId;
    }

    await PaymentModel.updateOne({ _id: paymentId }, { $set: update });
  }

  async findByUser(userId: string): Promise<Payment[]> {
    const documents = await PaymentModel.find({ userId }).lean();
    return MongoosePaymentMapper.toDomainEntities(
      documents as MongoosePayment[],
    );
  }

  async findByReceiver(receiverId: string): Promise<Payment[]> {
    const documents = await PaymentModel.find({
      instructorId: receiverId,
    }).lean();
    return MongoosePaymentMapper.toDomainEntities(
      documents as MongoosePayment[],
    );
  }
}

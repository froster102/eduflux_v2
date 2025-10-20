/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  PaymentModel,
  type MongoosePayment,
} from '@infrastructure/database/mongoose/model/MongoosePayment';
import { MongoosePaymentMapper } from '@infrastructure/database/mongoose/model/payment/mapper/MongoosePaymentMapper';
import { MongooseBaseRepository } from '@infrastructure/database/repository/base/MongooseBaseRepository';
import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { Payment } from '@payment/entity/Payment';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import type { FindExistingPaymentQuery } from '@payment/repository/types/FindExistingPaymentQuery';
import type { PaymentQueryParameters } from '@payment/repository/types/PaymentQueryParameters';
import type { PaymentQueryResult } from '@payment/repository/types/PaymentQueryResult';
import type { PaymentSummaryAggregation } from '@payment/repository/types/PaymentSummaryAggregation';
import { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';
import type { FilterQuery } from 'mongoose';

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

  async findMany(query?: PaymentQueryParameters): Promise<PaymentQueryResult> {
    const filter: FilterQuery<MongoosePayment> = {};

    if (query) {
      if (query.filter?.status) {
        filter.status = query.filter.status;
      }
      if (query.filter?.instructorId) {
        filter.instructorId = query.filter.instructorId;
      }
      if (query.filter?.type) {
        filter.type = query.filter.type;
      }
      if (query.filter?.referenceId) {
        filter.referenceId = {
          $regex: query.filter.referenceId,
          $options: 'i',
        };
      }
    }

    const limit = query?.limit ?? this.defaultLimit;
    const offset = query?.offset ?? this.defaultOffset;

    const [totalCount, docs] = await Promise.all([
      PaymentModel.countDocuments(query),
      PaymentModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),
    ]);

    return {
      totalCount,
      payments: MongoosePaymentMapper.toDomainEntities(docs),
    };
  }

  async aggregatePaymentSummary(
    groupBy: PaymentSummaryGroup,
    filter: PaymentQueryParameters['filter'],
    startDate?: Date,
    endDate?: Date,
  ): Promise<PaymentSummaryAggregation[]> {
    const match: FilterQuery<MongoosePayment> = { ...filter };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    let groupId: any;
    switch (groupBy) {
      case PaymentSummaryGroup.MONTH:
        groupId = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        break;
      case PaymentSummaryGroup.YEAR:
        groupId = { year: { $year: '$createdAt' } };
        break;
      case PaymentSummaryGroup.CUSTOM:
        groupId = null;
        break;
    }

    const pipeline: any[] = [{ $match: match }];

    pipeline.push({
      $group: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        _id: groupId,
        instructorRevenue: { $sum: '$instructorRevenue' },
        platformFee: { $sum: '$platformFee' },
        totalAmount: { $sum: '$totalAmount' },
        completedPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', PaymentStatus.COMPLETED] }, 1, 0],
          },
        },
      },
    });

    if (groupBy === PaymentSummaryGroup.MONTH) {
      pipeline.push({ $sort: { '_id.year': 1, '_id.month': 1 } });
    } else if (groupBy === PaymentSummaryGroup.YEAR) {
      pipeline.push({ $sort: { '_id.year': 1 } });
    }

    const results: Array<{
      _id: { year: number; month?: number } | null;
      instructorRevenue: number;
      platformFee: number;
      totalAmount: number;
      completedPayments: number;
    }> = await PaymentModel.aggregate(pipeline);

    return results.map((r) => ({
      period:
        groupBy === PaymentSummaryGroup.MONTH
          ? `${r._id?.year}-${String(r._id?.month ?? 0).padStart(2, '0')}`
          : groupBy === PaymentSummaryGroup.YEAR
            ? `${r._id?.year}`
            : 'custom',
      instructorRevenue: r.instructorRevenue,
      platformFee: r.platformFee,
      totalAmount: r.totalAmount,
      completedPayments: r.completedPayments,
    }));
  }
}

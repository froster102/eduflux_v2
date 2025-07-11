import { Transaction } from '@/domain/entities/transaction.entity';
import { IMapper } from './interface/mapper.interface';
import { ITransaction } from '../database/model/transaction.model';
import { Currency } from '@/shared/constants/currency';

export class TransactionMapper implements IMapper<Transaction, ITransaction> {
  toDomain(transaction: ITransaction): Transaction {
    return Transaction.fromPersistence(
      transaction._id.toString(),
      transaction.providerPaymentId,
      transaction.paymentProvider,
      transaction.status,
      transaction.paymentPurpose,
      transaction.amount,
      transaction.currency as Currency,
      transaction.payerId,
      transaction.metadata,
      transaction.createdAt,
      transaction.updatedAt,
      transaction.failureReason,
    );
  }

  toPersistence(raw: Transaction): Partial<ITransaction> {
    return {
      _id: raw.id,
      providerPaymentId: raw.providerPaymentId,
      paymentProvider: raw.paymentProvider,
      status: raw.status,
      paymentPurpose: raw.paymentPurpose,
      amount: raw.amount,
      currency: raw.currency,
      payerId: raw.payerId,
      metadata: raw.metadata,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      failureReason: raw.failureReason,
    };
  }

  toDomainArray(raw: ITransaction[]): Transaction[] {
    return raw.map((r) => this.toDomain(r));
  }
}

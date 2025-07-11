import type { IMapper } from '@/infrastructure/mappers/interface/mapper.interface';
import { Transaction } from '@/domain/entities/transaction.entity';
import { IBaseRepository } from '@/domain/repositories/base.respository';
import { MongoBaseRepositoryImpl } from './base.repository';
import { ITransaction, PaymentModel } from '../model/transaction.model';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { IPaymentRepository } from '@/domain/repositories/transaction.repository';

export class MongoPaymenRepositoryImpl
  extends MongoBaseRepositoryImpl<ITransaction, Transaction>
  implements IBaseRepository<Transaction>, IPaymentRepository
{
  constructor(
    @inject(TYPES.PaymentMapper)
    private readonly paymentMapper: IMapper<Transaction, ITransaction>,
  ) {
    super(PaymentModel, paymentMapper);
  }

  async findByProviderId(id: string): Promise<Transaction | null> {
    const payment = await PaymentModel.findOne({ providerPaymentId: id });
    return payment ? this.paymentMapper.toDomain(payment) : null;
  }
}

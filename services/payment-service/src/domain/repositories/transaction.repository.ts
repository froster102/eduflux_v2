import { Transaction } from '../entities/transaction.entity';
import { IBaseRepository } from './base.respository';

export interface IPaymentRepository extends IBaseRepository<Transaction> {
  findByProviderId(id: string): Promise<Transaction | null>;
}

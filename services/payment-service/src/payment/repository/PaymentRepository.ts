import type { Payment } from '@payment/entity/Payment';
import type { BaseRepositoryPort } from '@shared/common/port/persistence/BaseRepositoryPort';
import type { FindExistingPaymentQuery } from '@payment/repository/types/FindExistingPaymentQuery';
import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';

export interface IPaymentRepository extends BaseRepositoryPort<Payment> {
  save(payment: Payment): Promise<Payment>;
  findById(paymentId: string): Promise<Payment | null>;
  findExistingPayment(query: FindExistingPaymentQuery): Promise<Payment | null>;
  findByTransactionId(id: string): Promise<Payment>;
  delete(id: string): Promise<void>;
  updateStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<void>;
  findByUser(userId: string): Promise<Payment[]>;
  findByReceiver(receiverId: string): Promise<Payment[]>;
}

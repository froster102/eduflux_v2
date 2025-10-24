import { Payment } from '@payment/entity/Payment';
import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import { PaymentType } from '@payment/entity/enum/PaymentType';

interface PaymentFactoryOptions {
  userId: string;
  instructorId: string;
  amount: number;
  paymentType: PaymentType;
  referenceId: string;
  idempotencyKey: string;
  currency?: string;
  platformFeeRate?: number;
}

export class PaymentFactory {
  static create({
    userId,
    instructorId,
    amount,
    paymentType,
    referenceId,
    idempotencyKey,
    currency = 'USD',
    platformFeeRate = 0.3,
  }: PaymentFactoryOptions): Payment {
    const paymentId = crypto.randomUUID();
    return Payment.new({
      id: paymentId,
      userId,
      instructorId,
      totalAmount: amount,
      type: paymentType,
      referenceId,
      idempotencyKey,
      platformFee: Number((amount * platformFeeRate).toFixed(2)),
      instructorRevenue: Number((amount * (1 - platformFeeRate)).toFixed(2)),
      currency,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

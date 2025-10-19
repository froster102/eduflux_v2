import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';

export type CreatePaymentPayload = {
  id: string;
  userId: string;
  instructorId: string;
  type: PaymentType;
  referenceId: string;
  totalAmount: number;
  idempotencyKey: string;
  platformFee: number;
  instructorRevenue: number;
  currency: string;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

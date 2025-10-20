import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { Payment } from '@payment/entity/Payment';

export type HandleExistingPaymentPayload = {
  existingPayment: Payment;
  idempotencyKey: string;
  referenceId: string;
  paymentType: PaymentType;
  userId: string;
};

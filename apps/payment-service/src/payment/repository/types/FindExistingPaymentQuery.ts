import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';

export type FindExistingPaymentQuery = {
  userId: string;
  referenceId: string;
  paymentType: PaymentType;
  validStatuses: PaymentStatus[];
};

import type { Payment } from '@payment/entity/Payment';

export type PaymentQueryResult = {
  totalCount: number;
  payments: Payment[];
};

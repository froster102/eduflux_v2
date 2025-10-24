import type { HandleExistingPaymentPayload } from '@payment/service/types/HandleExistingPaymentPayload';

export type CreateNewPaymentPayload = Omit<
  HandleExistingPaymentPayload,
  'existingPayment'
>;

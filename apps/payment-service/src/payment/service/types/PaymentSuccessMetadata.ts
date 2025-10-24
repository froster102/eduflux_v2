import type { PaymentType } from '@payment/entity/enum/PaymentType';

export type PaymentSuccessMetadata = {
  payment_type: PaymentType;
  payment_id: string;
  reference_id: string;
};

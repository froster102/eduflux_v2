import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';

export interface PaymentSummaryQuery {
  instructorId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: PaymentStatus;
  type?: PaymentType;
}

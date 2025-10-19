import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { Event } from '@shared/common/events/Event';

export interface PaymentSucceededEvent extends Event {
  type: 'payment.succeeded';
  data: {
    paymentId: string;
    enrollmentId: string;
    type: PaymentType;
    learnerId: string;
    instructorId: 789;
    totalAmount: 19.99;
    platformFee: 6.0;
    instructorRevenue: 13.99;
    currency: 'USD';
    gatewayTransactionTd: string;
    timestamp: string;
  };
}

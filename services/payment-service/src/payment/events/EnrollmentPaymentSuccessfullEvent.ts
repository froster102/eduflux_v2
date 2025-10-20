import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { Event } from '@shared/common/events/Event';
import type { EnrollmentEvents } from '@shared/events/enum/EnrollmentEvents';

export interface EnrollmentPaymentSuccessfullEvent extends Event {
  readonly id: string;
  readonly type: EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESS;
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly totalAmount: number;
  readonly platformFee: number;
  readonly instructorRevenue: number;
  readonly currency: 'USD';
  readonly timestamp: string;
}

import type { PaymentType } from '@shared/constants/PaymentType';
import type { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import type { Event } from '@shared/events/Event';

export interface EnrollmentPaymentSuccessfullEvent extends Event {
  readonly id: string;
  readonly type: EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESSFULL;
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

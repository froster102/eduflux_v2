import type { PaymentType } from '@core/common/enums/PaymentType';
import type { Event } from '@core/common/events/Event';
import type { EnrollmentEvents } from '@core/domain/enrollment/events/enum/EnrollmentEvents';

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

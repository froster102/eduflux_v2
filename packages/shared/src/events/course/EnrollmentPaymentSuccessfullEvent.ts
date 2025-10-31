import type { PaymentType } from '@shared/constants/PaymentType';
import { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import { Event } from '@shared/events/Event';

export interface EnrollmentPaymentSuccessfullEventPayload {
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly totalAmount: number;
  readonly platformFee: number;
  readonly instructorRevenue: number;
  readonly currency: 'USD';
}

export class EnrollmentPaymentSuccessfullEvent extends Event<EnrollmentPaymentSuccessfullEventPayload> {
  static readonly EVENT_NAME = EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESSFULL;

  constructor(id: string, payload: EnrollmentPaymentSuccessfullEventPayload) {
    super({
      id,
      name: EnrollmentEvents.ENROLLMENT_PAYMENT_SUCCESSFULL,
    }, payload);
  }
}

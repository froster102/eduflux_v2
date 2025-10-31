import type { PaymentType } from '@shared/constants/PaymentType';
import { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import { Event } from '@shared/events/Event';

export interface EnrollmentCreatedEventPayload {
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly enrollmentId: string;
  readonly instructorId: string;
  readonly totalAmount: number;
  readonly platformFee: number;
  readonly instructorRevenue: number;
  readonly currency: 'USD';
}

export class EnrollmentCreatedEvent extends Event<EnrollmentCreatedEventPayload> {
  static readonly EVENT_NAME = EnrollmentEvents.ENROLLMENT_CREATED;

  constructor(id: string, payload: EnrollmentCreatedEventPayload) {
    super({ id, name: EnrollmentEvents.ENROLLMENT_CREATED }, payload);
  }
}

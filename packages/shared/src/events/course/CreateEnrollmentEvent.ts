import type { PaymentType } from '@shared/constants/PaymentType';
import { EnrollmentEvents } from '@shared/events/course/enum/EnrollmentEvents';
import { Event } from '@shared/events/Event';

export interface CreateEnrollmentEventPayload {
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly payerId: string;
  readonly recieverId: string;
  readonly itemId: string;
  readonly itemType: 'course' | 'session';
}

export class CreateEnrollmentEvent extends Event<CreateEnrollmentEventPayload> {
  static readonly EVENT_NAME = EnrollmentEvents.CREATE_ENROLLMENT;

  constructor(id: string, payload: CreateEnrollmentEventPayload) {
    super({ id, name: EnrollmentEvents.CREATE_ENROLLMENT }, payload);
  }
}

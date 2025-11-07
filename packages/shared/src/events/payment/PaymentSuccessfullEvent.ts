import { PaymentEvents } from '@shared/events/payment/enum/PaymentEvents';
import type { PaymentType } from '@shared/constants/PaymentType';
import { Event } from '@shared/events/Event';

export interface PaymentSuccessfullEventPayload {
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly payerId: string;
  readonly recieverId: string;
  readonly itemId: string;
  readonly itemType: 'course' | 'session';
  readonly platformFee: number;
}

export class PaymentSuccessfullEvent extends Event<PaymentSuccessfullEventPayload> {
  static readonly EVENT_NAME = PaymentEvents.PAYMENT_SUCCESSFULL;

  constructor(id: string, payload: PaymentSuccessfullEventPayload) {
    super({ id, name: PaymentEvents.PAYMENT_SUCCESSFULL }, payload);
  }
}

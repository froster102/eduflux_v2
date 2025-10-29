import type { PaymentType } from '@shared/constants/PaymentType';
import type { SessionEvents } from '@shared/events/session/enum/SessionEvents';
import type { Event } from '@shared/events/Event';

export interface SessionPaymentSuccessfullEvent extends Event {
  readonly id: string;
  readonly type: SessionEvents.SESSION_PAYMENT_SUCCESSFULL;
  readonly paymentType: PaymentType;
  readonly paymentId: string;
  readonly sessionId: string;
  readonly instructorId: string;
  readonly totalAmount: number;
  readonly platformFee: number;
  readonly instructorRevenue: number;
  readonly currency: 'USD';
  readonly timestamp: string;
}

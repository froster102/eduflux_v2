import type { PaymentEvents } from '@core/common/events/enum/PaymentEvents';
import type { Event } from '@core/common/events/Event';

export interface PaymentEvent extends Event {
  type: PaymentEvents;
  correlationId: string;
  paymentId: string;
  providerPaymentId: string | null;
  paymentProvider: PaymentProvider;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  amount: number;
  currency: string;
  reason?: string;
  metadata: Record<string, any>;
  occurredAt: string;
}

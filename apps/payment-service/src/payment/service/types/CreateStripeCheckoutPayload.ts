import type { StripeCheckoutItem } from '@payment/service/types/StripeCheckoutItem';

export interface CreateStripeCheckoutPayload {
  item: StripeCheckoutItem;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
}

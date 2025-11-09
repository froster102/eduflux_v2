import type { Payment } from '@payment/entity/Payment';
import type { CreateStripeCheckoutPayload } from '@payment/service/types/CreateStripeCheckoutPayload';

interface CheckoutItemInfo {
  title: string;
  amount: number;
}

interface CheckoutUrls {
  successUrl: string;
  cancelUrl: string;
}

export class PrepareCheckout {
  static fromRequest(
    payment: Payment,
    itemInfo: CheckoutItemInfo,
    urls: CheckoutUrls,
  ): CreateStripeCheckoutPayload {
    return {
      item: {
        name: itemInfo.title,
        description: `Payment for ${itemInfo.title}`,
        images: [],
        amount: Math.round(itemInfo.amount * 100), // Convert to cents
      },
      metadata: {
        payment_id: payment.id,
        payment_type: payment.type,
        reference_id: payment.referenceId,
      },
      successUrl: urls.successUrl,
      cancelUrl: urls.cancelUrl,
      idempotencyKey: payment.idempotencyKey,
    };
  }
}

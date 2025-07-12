import {
  CheckoutSessionResponse,
  InitiateCheckoutSessionDto,
  IStripeGateway,
  StripeWebhookEvent,
} from '@/application/ports/stripe.gateway';
import { stripeConfig } from '@/shared/config/stripe.config';
import { PAYMENT_SERVICE } from '@/shared/constants/service';
import { Logger } from '@/shared/utils/logger';
import Stripe from 'stripe';
import { StripeException } from '../exception/stripe.exception';

export class StripeClient implements IStripeGateway {
  private stripe: Stripe;
  private webhookSecret: string;
  private logger = new Logger(PAYMENT_SERVICE);

  constructor() {
    this.stripe = new Stripe(stripeConfig.STRIPE_API_SECRET, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });
    this.webhookSecret = stripeConfig.STRIPE_WEBHOOK_SECRET;
  }

  async createCheckoutSession(
    initiateCheckoutSessionDto: InitiateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse> {
    const { amount, cancelUrl, clientReferenceId, metadata, successUrl } =
      initiateCheckoutSessionDto;
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'USD',
              product_data: {
                name: (metadata.name as string) || 'unknown_product',
                images: [metadata.image] as string[],
              },
              unit_amount: amount,
            },
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: clientReferenceId,
        metadata,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url!,
        paymentId: clientReferenceId,
      };
    } catch (error) {
      this.logger.error(
        `Error creating Stripe Checkout Session: ${(error as Record<string, any>)?.message}`,
      );
      throw new StripeException(
        `Stripe api error ${(error as Record<string, any>)?.message}`,
      );
    }
  }

  async constructEventFromWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): Promise<StripeWebhookEvent> {
    const event = await this.stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      this.webhookSecret,
    );

    return event as StripeWebhookEvent;
  }
}

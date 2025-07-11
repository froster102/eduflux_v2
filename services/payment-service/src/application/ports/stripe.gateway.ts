export interface InitiateCheckoutSessionDto {
  amount: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId: string;
  customerEmail?: string;
  metadata: Record<string, any>;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  paymentId: string;
}

export interface StripeWebhookEvent {
  id: string;
  object: 'event';
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      application: null;
      automatic_payment_methods: null;
      cancellation_reason: null;
      client_secret: string;
      created: number;
      customer: null;
      description: null;
      flow_directions: null;
      last_setup_error: null;
      latest_attempt: null;
      livemode: boolean;
      mandate: null;
      metadata: Record<string, any>;
      next_action: null;
      on_behalf_of: null;
      payment_method: string;
      payment_method_options: {
        acss_debit: {
          currency: string;
          mandate_options: {
            interval_description: string;
            payment_schedule: string;
            transaction_type: string;
          };
          verification_method: string;
        };
      };
      payment_method_types: string[];
      single_use_mandate: null;
      status: string;
      usage: string;
    };
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: null;
    idempotency_key: null;
  };
  type: string;
}

export interface IStripeGateway {
  createCheckoutSession(
    dto: InitiateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse>;

  constructEventFromWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): Promise<StripeWebhookEvent>;
}

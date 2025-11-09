import { envVariables } from '@shared/env/env-variables';

export class StripeConfig {
  static readonly STRIPE_API_SECRET = envVariables.STRIPE_API_SECRET;
  static readonly STRIPE_WEBHOOK_SECRET = envVariables.STRIPE_WEBHOOK_SECRET;
}

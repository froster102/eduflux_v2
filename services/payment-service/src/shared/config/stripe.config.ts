import { envVariables } from '../validation/env-variables';

export const stripeConfig = {
  STRIPE_API_SECRET: envVariables.STRIPE_API_SECRET,
  STRIPE_WEBHOOK_SECRET: envVariables.STRIPE_WEBHOOK_SECRET,
};

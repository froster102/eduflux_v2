import { IUseCase } from './use-case.interface';

export interface HandleStripeWebhookInput {
  rawBody: string | Buffer;
  signature: string;
}

export interface HandleStripeWebhookOutput {
  success: boolean;
  message: string;
}

export interface IHandleStripeWebhookUseCase
  extends IUseCase<HandleStripeWebhookInput, HandleStripeWebhookOutput> {}

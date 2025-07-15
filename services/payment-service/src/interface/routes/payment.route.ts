import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import {
  HandleStripeWebhookInput,
  HandleStripeWebhookOutput,
} from '@/application/use-cases/handle-stripe-webhook.use-case';

@injectable()
export class PaymentRoutes {
  constructor(
    @inject(TYPES.HandleStripeWebhookUseCase)
    private readonly handleStripeWebhookUseCase: IUseCase<
      HandleStripeWebhookInput,
      HandleStripeWebhookOutput
    >,
  ) {}

  setupRoutes(): Elysia {
    return new Elysia().group('/api/payments', (group) =>
      group
        .post(
          '/webhooks/stripe',
          async ({ request, headers }) => {
            const buffer = await request.arrayBuffer();
            const nodeBuffer = Buffer.from(buffer);
            await this.handleStripeWebhookUseCase.execute({
              rawBody: nodeBuffer,
              signature: headers['stripe-signature'] as string,
            });
            return 'ok';
          },
          { parse: 'none' },
        )
        .post('/checkout', async () => {}),
    );
  }
}

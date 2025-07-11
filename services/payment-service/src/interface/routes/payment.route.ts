import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { HandleStripeWebhookUseCase } from '@/application/use-cases/handle-stripe-webhook.use-case';

@injectable()
export class PaymentRoutes {
  constructor(
    @inject(TYPES.HandleStripeWebhookUseCase)
    private readonly handleStripeWebhookUseCase: HandleStripeWebhookUseCase,
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

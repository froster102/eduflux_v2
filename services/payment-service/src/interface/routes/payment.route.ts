import type { IHandleStripeWebhookUseCase } from '@/application/use-cases/interface/handle-stripe-webhook.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';

@injectable()
export class PaymentRoutes {
  constructor(
    @inject(TYPES.HandleStripeWebhookUseCase)
    private readonly handleStripeWebhookUseCase: IHandleStripeWebhookUseCase,
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

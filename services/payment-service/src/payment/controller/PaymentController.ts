import { authenticaionMiddleware } from '@application/api/http/middleware/authenticationMiddleware';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { PaymentService } from '@payment/service/PaymentService';
import type { StripeService } from '@payment/service/StripeService';
import { jsonApiResponse } from '@shared/utils/jsonApi';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class PaymentController {
  constructor(
    @inject(PaymentDITokens.PaymentService)
    private readonly paymentService: PaymentService,
    @inject(PaymentDITokens.StripeService)
    private readonly stripeService: StripeService,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/payments', (group) =>
      group
        .post(
          '/webhooks/stripe',
          async ({ request, headers }) => {
            const buffer = await request.arrayBuffer();
            const nodeBuffer = Buffer.from(buffer);
            await this.stripeService.handleWebhook(
              nodeBuffer,
              headers['stripe-signature'] as string,
            );
            return 'ok';
          },
          { parse: 'none' },
        )
        .use(authenticaionMiddleware)
        .post('/checkout/:type/:referenceId', async ({ user, params }) => {
          const response = await this.paymentService.handleCheckout(
            params.type as 'course' | 'session',
            params.referenceId,
            user.id,
          );
          return jsonApiResponse({ data: response });
        }),
    );
  }
}

import { authenticaionMiddleware } from '@application/api/http/middleware/authenticationMiddleware';
import { getPaymentsSchema } from '@payment/controller/validators/getPaymentsSchema';
import { getPaymentSummarySchema } from '@payment/controller/validators/getPaymentSummarySchema';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { PaymentService } from '@payment/service/PaymentService';
import type { StripeService } from '@payment/service/StripeService';
import { calculateOffset } from '@shared/utils/helper';
import { jsonApiResponse, parseJsonApiQuery } from '@shared/utils/jsonApi';
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
        .get('/me', async ({ user, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getPaymentsSchema.parse(jsonApiQuery);
          const { totalCount, ...result } =
            await this.paymentService.getPayments({
              executor: user,
              query: {
                filter: { ...parsedQuery.filter, instructorId: user.id },
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });

          return jsonApiResponse({
            data: result,
            totalCount,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
          });
        })
        .get('/', async ({ user, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getPaymentsSchema.parse(jsonApiQuery);
          const { totalCount, payments } =
            await this.paymentService.getPayments({
              executor: user,
              query: {
                filter: parsedQuery.filter,
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });

          return jsonApiResponse({
            data: payments,
            totalCount,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
          });
        })
        .get('/summary', async ({ user, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getPaymentSummarySchema.parse(jsonApiQuery);
          const summary = await this.paymentService.getPaymentsWithSummary({
            ...parsedQuery,
            user,
          });
          return jsonApiResponse({ data: summary });
        })
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

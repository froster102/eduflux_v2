import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import { handleCheckoutSchema } from '@api/http/validators/handleCheckoutSchema';
import { CheckoutDITokens } from '@core/application/checkout/di/CheckoutDITokens';
import type { HandleCheckoutUseCase } from '@core/application/checkout/usecase/HandleCheckoutUseCase';
import { jsonApiResponse } from '@eduflux-v2/shared/utils/jsonApi';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class CheckoutController {
  constructor(
    @inject(CheckoutDITokens.HandleCheckoutUseCase)
    private readonly handleCheckoutUseCase: HandleCheckoutUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/checkout', (group) =>
      group.use(authenticaionMiddleware).post('/', async ({ body, user }) => {
        const parsedBody = handleCheckoutSchema.parse(body);
        const response = await this.handleCheckoutUseCase.execute({
          item: parsedBody.item,
          executor: user,
        });
        return jsonApiResponse({ data: response });
      }),
    );
  }
}

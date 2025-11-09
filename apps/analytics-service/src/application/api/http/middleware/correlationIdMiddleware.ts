import { asyncLocalStorage } from '@shared/utils/async-store';
import Elysia from 'elysia';
import { v4 as uuidV4 } from 'uuid';

export const correlationIdSetupMiddleware = (app: Elysia) => {
  app.onRequest(({ request }) => {
    const correlationIdHeader = request.headers.get('x-correlation-id');
    const correlationId = correlationIdHeader || uuidV4();

    asyncLocalStorage.enterWith(new Map([['correlationId', correlationId]]));
  });

  return app;
};

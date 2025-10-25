import { asyncLocalStorage } from '@shared/util/store';
import Elysia from 'elysia';
import { v4 as uuidV4 } from 'uuid';

export const correlationIdSetupMiddleware = (app: Elysia) => {
  app.onRequest(({ request }) => {
    const store = new Map<string, string>();
    const correlationIdHeader = request.headers.get('x-correlation-id');
    const correlationId = correlationIdHeader || uuidV4();

    store.set('correlationId', correlationId);

    asyncLocalStorage.enterWith(store);
  });

  return app;
};

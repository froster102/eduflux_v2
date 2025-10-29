import { asyncLocalStorage } from '@shared/utils/async-store';
import type { Context, Next } from 'hono';
import { v4 as uuidV4 } from 'uuid';

export const correlationIdSetupMiddleware = async (c: Context, next: Next) => {
  const store = new Map<string, string>();
  const correlationIdHeader = c.req.header('x-correlation-id');
  const correlationId = correlationIdHeader || uuidV4();

  store.set('correlationId', correlationId);

  asyncLocalStorage.enterWith(store);
  await next();
};

import type { Context } from 'hono';
import type { HTTPResponseError } from 'hono/types';

export const errorHandler = (err: Error | HTTPResponseError, c: Context) => {
  return c.json({ message: err.message });
};

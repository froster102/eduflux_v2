import type { Context } from 'hono';
import httpStatus from 'http-status';

export function notFoundHandler(c: Context) {
  c.status(httpStatus.NOT_FOUND);
  return c.json({
    message: httpStatus[httpStatus.NOT_FOUND],
    path: c.req.url,
  });
}

import { Context } from 'hono';
import httpStatus from 'http-status';

export function notFoundHandler(c: Context) {
  c.status(httpStatus.NOT_EXTENDED);
  return c.json({
    statusCode: httpStatus.NOT_FOUND,
    message: httpStatus[httpStatus.NOT_FOUND],
    path: c.req.url,
  });
}

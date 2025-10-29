import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { z, ZodError } from 'zod/v4';
import httpStatus from 'http-status';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';
import { getHttpErrorCode } from '@shared/errors/error-code';
import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { container } from '@di/RootModule';
import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import type { HTTPResponseError } from 'hono/types';
import { createJsonApiError } from '@eduflux-v2/shared/utils/jsonApi';

export const errorHandler = (error: Error | HTTPResponseError, c: Context) => {
  const logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('HttpErrorHandler');

  logger.error(error?.message, error as Record<string, any>);

  if (error instanceof ZodError) {
    c.status(httpStatus.BAD_REQUEST);
    return c.json(
      createJsonApiError(
        httpStatus.BAD_REQUEST,
        Code.VALIDATION_ERROR.code,
        Code.VALIDATION_ERROR.message,
        JSON.stringify(z.treeifyError(error)),
      ),
    );
  }
  if (error instanceof Exception) {
    const httpStatusCode = getHttpErrorCode(error.code) as StatusCode;
    c.status(httpStatusCode);
    return c.json(
      createJsonApiError(httpStatusCode, error.code, error.message),
    );
  }

  c.status(httpStatus.INTERNAL_SERVER_ERROR);

  return c.json(
    createJsonApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      Code.INTERNAL_ERROR.code,
      Code.INTERNAL_ERROR.message,
    ),
  );
};

export const notFoundHandler = (c: Context) => {
  c.status(httpStatus.NOT_FOUND);
  return c.json(
    createJsonApiError(
      httpStatus.NOT_FOUND,
      Code.NOT_FOUND_ERROR.code,
      Code.NOT_FOUND_ERROR.message,
    ),
  );
};

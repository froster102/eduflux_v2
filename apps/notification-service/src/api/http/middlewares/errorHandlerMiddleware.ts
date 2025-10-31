import Elysia from 'elysia';
import { container } from 'src/di/RootModule';
import { z, ZodError } from 'zod/v4';
import httpStatus from 'http-status';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';
import { getHttpErrorCode } from '@shared/errors/error-code';
import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { createJsonApiError } from '@eduflux-v2/shared/utils/jsonApi';

const logger = container
  .get<LoggerPort>(SharedCoreDITokens.Logger)
  .fromContext('HTTP');

export const errorHandler = new Elysia()
  .onError(({ code, set, error }) => {
    // internal logging
    logger.error((error as Error)?.message, error as Record<string, any>);

    // external client response use generic error messages
    if (error instanceof ZodError) {
      set.status = httpStatus.BAD_REQUEST;
      return createJsonApiError(
        httpStatus.BAD_REQUEST,
        Code.VALIDATION_ERROR.code,
        Code.VALIDATION_ERROR.message,
        JSON.stringify(z.treeifyError(error)),
      );
    }

    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return createJsonApiError(
        httpStatus.NOT_FOUND,
        Code.NOT_FOUND_ERROR.code,
        Code.NOT_FOUND_ERROR.message,
      );
    }

    if (error instanceof Exception) {
      const statusCode = getHttpErrorCode(error.code);
      set.status = statusCode;
      return createJsonApiError(statusCode, error.code, error.message);
    }

    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    return createJsonApiError(
      statusCode,
      Code.INTERNAL_ERROR.code,
      Code.INTERNAL_ERROR.message,
    );
  })
  .as('global');

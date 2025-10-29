import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import Elysia from 'elysia';
import { ZodError } from 'zod/v4';
import httpStatus from 'http-status';
import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { getHttpErrorCode } from '@shared/errors/error-code';
import { container } from '@di/RootModule';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

const logger = container
  .get<LoggerPort>(CoreDITokens.Logger)
  .fromContext('HTTP');

export const errorHandler = new Elysia()
  .onError(({ code, set, error }) => {
    // internal logging
    logger.error((error as Error)?.message, error as Record<string, any>);

    // external client response use generic error messages
    if (error instanceof ZodError) {
      set.status = httpStatus.BAD_REQUEST;
      return {
        message: Code.VALIDATION_ERROR.message,
        code: Code.VALIDATION_ERROR.code,
        error: error.issues,
      };
    }

    if (error instanceof Exception) {
      set.status = getHttpErrorCode(error.code);
      return {
        message: error.message,
        code: error.code,
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return {
        message: Code.NOT_FOUND_ERROR.message,
        code: Code.NOT_FOUND_ERROR.code,
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;

    return {
      message: Code.INTERNAL_ERROR.message,
      code: Code.INTERNAL_ERROR.code,
    };
  })
  .as('global');

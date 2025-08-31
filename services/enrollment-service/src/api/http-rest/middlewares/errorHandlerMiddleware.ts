import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import Elysia from 'elysia';
import { container } from 'src/di/RootModule';
import { z, ZodError } from 'zod/v4';
import httpStatus from 'http-status';
import { Exception } from '@core/common/exception/Exception';
import { getHttpErrorCode } from '@shared/errors/error-code';
import { Code } from '@core/common/error/Code';

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
        message: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        error: z.treeifyError(error),
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return {
        message: Code.NOT_FOUND_ERROR.message,
        code: Code.NOT_FOUND_ERROR.code,
      };
    }

    if (error instanceof Exception) {
      set.status = getHttpErrorCode(error.code);
      return {
        message: error.message,
        code: error.code,
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;
    return {
      message: Code.INTERNAL_ERROR.message,
      code: Code.INTERNAL_ERROR.code,
    };
  })
  .as('global');

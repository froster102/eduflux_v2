import { ApplicationException } from '@/application/exceptions/application.exception';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';
import {
  AppErrorCode,
  getHttpErrorCode,
  PUBLIC_ERROR_MESSAGES,
} from '@/shared/errors/error-code';
import { Logger } from '@/shared/utils/logger';
import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { z, ZodError } from 'zod/v4';

const logger = new Logger(ENROLLMENT_SERVICE);

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
        message: PUBLIC_ERROR_MESSAGES.NOT_FOUND,
        path: AppErrorCode.NOT_FOUND,
      };
    }

    if (error instanceof ApplicationException) {
      set.status = getHttpErrorCode(error.code);

      return {
        message: error.publicMessage || PUBLIC_ERROR_MESSAGES[error.code],
        code: error.code,
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;
    return {
      message: PUBLIC_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      code: AppErrorCode.INTERNAL_SERVER_ERROR,
    };
  })
  .as('global');

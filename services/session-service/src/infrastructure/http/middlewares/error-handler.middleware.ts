import type { ILogger } from '@/shared/common/interface/logger.interface';
import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import type { HttpResponse } from '../interfaces/http-response.interface';
import { ApplicationException } from '@/application/exceptions/application.exception';
import {
  AppErrorCode,
  getHttpErrorCode,
  PUBLIC_ERROR_MESSAGES,
} from '@/shared/errors/error-code';
import z, { ZodError } from 'zod/v4';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';

const logger = container.get<ILogger>(TYPES.Logger).fromContext('HTTP');

export const errorHandler = new Elysia()
  .onError(({ code, set, error }): HttpResponse<object> => {
    // internal logging
    logger.error((error as Error)?.message, error as Record<string, any>);

    // external client response use generic error messages
    if (error instanceof ZodError) {
      set.status = httpStatus.BAD_REQUEST;
      return {
        message: PUBLIC_ERROR_MESSAGES.INVALID_INPUT,
        code: AppErrorCode.INVALID_INPUT,
        error: z.treeifyError(error),
      };
    }

    if (error instanceof ApplicationException) {
      set.status = getHttpErrorCode(error.code);
      return {
        message: error?.publicMessage || PUBLIC_ERROR_MESSAGES[error.code],
        code: error.code,
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return {
        message: PUBLIC_ERROR_MESSAGES.NOT_FOUND,
        code: AppErrorCode.NOT_FOUND,
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;

    return {
      message: PUBLIC_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      code: AppErrorCode.INTERNAL_SERVER_ERROR,
    };
  })
  .as('global');

import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { ZodError, z } from 'zod/v4';
import { httpServerConfig } from '@/shared/config/httpServerConfig';
import { AppError } from '@/shared/error/app-error';
import { getHttpErrorCode } from '@/shared/error/error-code';

export const errorHandler = new Elysia()
  .onError(({ code, set, error }) => {
    if (error instanceof ZodError) {
      set.status = httpStatus.BAD_REQUEST;
      return {
        message: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        error: z.treeifyError(error),
      };
    }

    if (error instanceof AppError) {
      set.status = getHttpErrorCode(error.code);
      return {
        message: error.message,
        code: error.code,
        error: httpServerConfig.NODE_ENV === 'development' ? error : {},
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return {
        message: 'Route not found',
        code: 'NOT_FOUND',
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;
    return {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      error: httpServerConfig.NODE_ENV === 'development' ? error : {},
    };
  })
  .as('global');

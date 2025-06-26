import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { HttpResponse } from '../interfaces/http-response.interface';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { getHttpErrorCode } from '@/shared/errors/error-code';
import z, { ZodError } from 'zod/v4';
import { serverConfig } from '@/shared/config/server.config';

export const errorHandler = new Elysia()
  .onError(({ code, set, error }): HttpResponse<object> => {
    if (error instanceof ZodError) {
      set.status = httpStatus.BAD_REQUEST;
      return {
        message: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        error: z.treeifyError(error),
      };
    }

    if (error instanceof ApplicationException) {
      set.status = getHttpErrorCode(error.code);
      return {
        message: error.message,
        code: error.code,
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
      error: serverConfig.NODE_ENV === 'development' ? error : {},
    };
  })
  .as('global');

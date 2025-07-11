import { ApplicationException } from '@/application/exceptions/application.exception';
import { getHttpErrorCode } from '@/shared/errors/error-code';
import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { z, ZodError } from 'zod/v4';

export const errorHandler = new Elysia()
  .onError(({ code, set, request, error }) => {
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
        message: httpStatus[httpStatus.NOT_FOUND],
        path: request.url,
      };
    }

    if (error instanceof ApplicationException) {
      set.status = getHttpErrorCode(error.code);

      return {
        message: error.message,
        path: request.url,
      };
    }

    set.status = httpStatus.INTERNAL_SERVER_ERROR;
    return {
      message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
      path: request.url,
    };
  })
  .as('global');

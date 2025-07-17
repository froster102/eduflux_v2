import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { HttpResponse } from '../interfaces/http-response.interface';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { getHttpErrorCode } from '@/shared/errors/error-code';
import { Logger } from '@/shared/utils/logger';
import { USER_SERVICE } from '@/shared/constants/services';

const logger = new Logger(USER_SERVICE);

export const errorHandler = new Elysia()
  .onError(({ code, set, request, error }): HttpResponse<any> => {
    logger.error((error as Error)?.message);

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

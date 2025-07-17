import { ApplicationException } from '@/application/exceptions/application.exception';
import { PAYMENT_SERVICE } from '@/shared/constants/service';
import {
  AppErrorCode,
  getHttpErrorCode,
  PUBLIC_ERROR_MESSAGES,
} from '@/shared/error/error-code';
import { Logger } from '@/shared/utils/logger';
import { Elysia } from 'elysia';
import httpStatus from 'http-status';

const logger = new Logger(PAYMENT_SERVICE);
export const errorHandler = new Elysia()
  .onError(({ code, set, error }) => {
    // internal logging
    logger.error((error as Error)?.message, error as Record<string, any>);

    // external client response use generic error messages

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

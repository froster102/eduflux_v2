import { Logger } from '../utils/logger';
import httpStatus from 'http-status';

export enum AppErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

//Http status code mapping

export const errorCodeToHttpStatusCode: { [key in AppErrorCode]?: number } = {
  [AppErrorCode.INVALID_INPUT]: httpStatus.BAD_REQUEST,
  [AppErrorCode.CONFLICT]: httpStatus.CONFLICT,
  [AppErrorCode.FORBIDDEN]: httpStatus.FORBIDDEN,
  [AppErrorCode.NOT_FOUND]: httpStatus.NOT_FOUND,
  [AppErrorCode.UNAUTHORIZED]: httpStatus.UNAUTHORIZED,
};

export const getHttpErrorCode = (code: AppErrorCode | string): number => {
  if (Object.prototype.hasOwnProperty.call(errorCodeToHttpStatusCode, code)) {
    const statusCode = errorCodeToHttpStatusCode[code as AppErrorCode];
    if (statusCode !== undefined) {
      return statusCode;
    }
  }

  const logger = new Logger('ERROR_HANDLER');

  logger.warn(
    `[ERROR_HANDLER] Unknown application error code '${code}'. Defaulting to 500.`,
  );
  return httpStatus.INTERNAL_SERVER_ERROR;
};

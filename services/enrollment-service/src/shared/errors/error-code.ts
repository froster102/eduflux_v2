import { status as grpcStatus } from '@grpc/grpc-js';
import { Logger } from '../utils/logger';
import httpStatus from 'http-status';

export enum AppErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

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

//Grpc status code mapping

export const errorCodeToGrpcStatusCode: { [key in AppErrorCode]?: number } = {
  [AppErrorCode.CONFLICT]: grpcStatus.ALREADY_EXISTS,
  [AppErrorCode.FORBIDDEN]: grpcStatus.PERMISSION_DENIED,
  [AppErrorCode.INVALID_INPUT]: grpcStatus.INVALID_ARGUMENT,
  [AppErrorCode.UNAUTHORIZED]: grpcStatus.UNAUTHENTICATED,
  [AppErrorCode.NOT_FOUND]: grpcStatus.NOT_FOUND,
};

export const getGrpcStatusCode = (code: AppErrorCode | string): number => {
  if (Object.prototype.hasOwnProperty.call(errorCodeToGrpcStatusCode, code)) {
    const statusCode = errorCodeToGrpcStatusCode[code as AppErrorCode];
    if (statusCode !== undefined) {
      return statusCode;
    }

    const logger = new Logger('ERROR_HANDLER');

    logger.warn(`[ERROR_HANDLER] Unknown application error code '${code}'`);
  }
  return grpcStatus.INTERNAL;
};

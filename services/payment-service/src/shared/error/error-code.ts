import type { ILogger } from '../common/interface/logger.interface';
import httpStatus from 'http-status';
import { status as grpcStatus } from '@grpc/grpc-js';
import { container } from '../di/container';
import { TYPES } from '../di/types';

export enum AppErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

function getLogger() {
  if (container) {
    return container.get<ILogger>(TYPES.Logger).fromContext('ERROR_CODE');
  }
}

export const PUBLIC_ERROR_MESSAGES: Record<AppErrorCode, string> = {
  [AppErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [AppErrorCode.FORBIDDEN]: 'You are not authorized to perform this action.',
  [AppErrorCode.INVALID_INPUT]: 'One or more input fields are invalid.',
  [AppErrorCode.INTERNAL_SERVER_ERROR]:
    'An unexpected server error occurred. Please try again later.',
  [AppErrorCode.CONFLICT]: 'The requested resource already exists',
  [AppErrorCode.UNAUTHORIZED]: 'Unauthorized',
};

export const errorCodeToHttpStatusCode: { [key in AppErrorCode]?: number } = {
  [AppErrorCode.INVALID_INPUT]: httpStatus.BAD_REQUEST,
  [AppErrorCode.CONFLICT]: httpStatus.CONFLICT,
  [AppErrorCode.FORBIDDEN]: httpStatus.FORBIDDEN,
  [AppErrorCode.INTERNAL_SERVER_ERROR]: httpStatus.INTERNAL_SERVER_ERROR,
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

  getLogger()!.warn(
    `[ERROR_HANDLER] Unknown application error code '${code}'. Defaulting to 500.`,
  );
  return httpStatus.INTERNAL_SERVER_ERROR;
};

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

    getLogger()!.warn(
      `[ERROR_HANDLER] Unknown application error code '${code}'`,
    );
    return grpcStatus.INTERNAL;
  }
  return grpcStatus.INTERNAL;
};

import { status as grpcStatus } from '@grpc/grpc-js';
import httpStatus from 'http-status';
import { Code } from '@eduflux-v2/shared/exceptions/Code';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { container } from '@di/RootModule';

function getLogger() {
  return container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('ERROR_CODE');
}

//Http status code mapping
export const errorCodeToHttpStatusCode: Record<string, number> = {
  [Code.BAD_REQUEST_ERROR.code]: httpStatus.BAD_REQUEST,
  [Code.UNAUTHORIZED_ERROR.code]: httpStatus.UNAUTHORIZED,
  [Code.INTERNAL_ERROR.code]: httpStatus.INTERNAL_SERVER_ERROR,
  [Code.CONFLICT_ERROR.code]: httpStatus.CONFLICT,
  [Code.FORBIDDEN_ERROR.code]: httpStatus.FORBIDDEN,
  [Code.VALIDATION_ERROR.code]: httpStatus.BAD_REQUEST,
};

export const getHttpErrorCode = (code: string): number => {
  if (code in errorCodeToHttpStatusCode) {
    return errorCodeToHttpStatusCode[code];
  }

  getLogger().warn(
    `[ERROR_HANDLER] Unknown application error code '${code}'. Defaulting to 500.`,
  );
  return httpStatus.INTERNAL_SERVER_ERROR;
};

//Grpc status code mapping
export const errorCodeToGrpcStatusCode: Record<string, number> = {
  [Code.BAD_REQUEST_ERROR.code]: grpcStatus.INVALID_ARGUMENT,
  [Code.UNAUTHORIZED_ERROR.code]: grpcStatus.UNAUTHENTICATED,
  [Code.INTERNAL_ERROR.code]: grpcStatus.INTERNAL,
  [Code.CONFLICT_ERROR.code]: grpcStatus.ALREADY_EXISTS,
};

export const getGrpcStatusCode = (code: string): number => {
  if (code in errorCodeToGrpcStatusCode) {
    return errorCodeToGrpcStatusCode[code];
  }

  getLogger().warn(`[ERROR_HANDLER] Unknown application error code '${code}'`);
  return grpcStatus.INTERNAL;
};

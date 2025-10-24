import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Code } from '@core/common/errors/Code';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import httpStatus from 'http-status';
import { status as grpcStatus } from '@grpc/grpc-js';
import { container } from '@di/RootModule';

function getLogger() {
  return container.get<LoggerPort>(CoreDITokens.Logger);
}

export const errorCodeToHttpStatusCode: Record<string, number> = {
  [Code.BAD_REQUEST_ERROR.code]: httpStatus.BAD_REQUEST,
  [Code.UNAUTHORIZED_ERROR.code]: httpStatus.UNAUTHORIZED,
  [Code.WRONG_CREDENTIALS_ERROR.code]: httpStatus.UNAUTHORIZED,
  [Code.ACCESS_DENIED_ERROR.code]: httpStatus.FORBIDDEN,
  [Code.INTERNAL_ERROR.code]: httpStatus.INTERNAL_SERVER_ERROR,
  [Code.ENTITY_NOT_FOUND_ERROR.code]: httpStatus.NOT_FOUND,
  [Code.ENTITY_ALREADY_EXISTS_ERROR.code]: httpStatus.CONFLICT,
  [Code.ENTITY_VALIDATION_ERROR.code]: httpStatus.BAD_REQUEST,
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

export const errorCodeToGrpcStatusCode: Record<string, number> = {
  [Code.BAD_REQUEST_ERROR.code]: grpcStatus.INVALID_ARGUMENT,
  [Code.UNAUTHORIZED_ERROR.code]: grpcStatus.UNAUTHENTICATED,
  [Code.WRONG_CREDENTIALS_ERROR.code]: grpcStatus.UNAUTHENTICATED,
  [Code.ACCESS_DENIED_ERROR.code]: grpcStatus.PERMISSION_DENIED,
  [Code.INTERNAL_ERROR.code]: grpcStatus.INTERNAL,
  [Code.ENTITY_NOT_FOUND_ERROR.code]: grpcStatus.NOT_FOUND,
  [Code.ENTITY_ALREADY_EXISTS_ERROR.code]: grpcStatus.ALREADY_EXISTS,
  [Code.ENTITY_VALIDATION_ERROR.code]: grpcStatus.INVALID_ARGUMENT,
};

export const getGrpcStatusCode = (code: string): number => {
  if (code in errorCodeToGrpcStatusCode) {
    return errorCodeToGrpcStatusCode[code];
  }

  getLogger().warn(`[ERROR_HANDLER] Unknown application error code '${code}'`);
  return grpcStatus.INTERNAL;
};

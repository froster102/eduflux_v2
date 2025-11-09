import { status as grpcStatus } from '@grpc/grpc-js';
import { Code } from '@shared/exceptions/Code';
import httpStatus from 'http-status';

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

  return grpcStatus.INTERNAL;
};

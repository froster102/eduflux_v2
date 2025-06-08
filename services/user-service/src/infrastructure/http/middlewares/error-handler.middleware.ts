import { UnauthorizedException } from '@/application/exceptions/unauthorised.execption';
import { Elysia } from 'elysia';
import httpStatus from 'http-status';
import { HttpResponse } from '../interfaces/http-response.interface';
import { InvalidTokenException } from '@/application/exceptions/invalid-token.exception';

export const errorHandler = new Elysia()
  .onError(({ code, set, request, error }): HttpResponse<any> => {
    if (code === 'NOT_FOUND') {
      set.status = httpStatus.NOT_FOUND;
      return {
        statusCode: httpStatus.NOT_FOUND,
        message: httpStatus[httpStatus.NOT_FOUND],
        path: request.url,
      };
    }

    if (error instanceof UnauthorizedException) {
      set.status = httpStatus.UNAUTHORIZED;

      return {
        statusCode: httpStatus.UNAUTHORIZED,
        message: error.message,
        path: request.url,
      };
    }

    if (error instanceof InvalidTokenException) {
      set.status = httpStatus.UNAUTHORIZED;
      return {
        statusCode: httpStatus.UNAUTHORIZED,
        message: error.message,
      };
    }
  })
  .as('global');

import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { GetSessionUseCase } from '@core/application/session/usecase/GetSessionUseCase';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import {
  status,
  type sendUnaryData,
  type ServerUnaryCall,
} from '@grpc/grpc-js';

import { getGrpcStatusCode } from '@eduflux-v2/shared/errors/error-code';
import { inject } from 'inversify';
import type {
  BookSessionRequest,
  SessionServiceServer,
} from '@eduflux-v2/shared/adapters/grpc/generated/session';
import type {
  GetSessionRequest,
  Session,
} from '@eduflux-v2/shared/adapters/grpc/generated/session';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';

export class GrpcSessionServiceController implements SessionServiceServer {
  private logger: LoggerPort;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
    @inject(SessionDITokens.GetSessionUseCase)
    private readonly getSessionUseCase: GetSessionUseCase,
    @inject(SessionDITokens.BookSessionUseCase)
    private readonly bookSessionUseCase: BookSessionUseCase,
  ) {
    this.logger = logger.fromContext(GrpcSessionServiceController.name);
  }

  getSession(
    call: ServerUnaryCall<GetSessionRequest, Session>,
    callback: sendUnaryData<Session>,
  ): void {
    this.getSessionUseCase
      .execute({ sessionId: call.request.id })
      .then((result) => {
        const response: Session = {
          ...result,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          startTime: result.startTime.toISOString(),
          endTime: result.endTime.toISOString(),
          paymentId: result.paymentId ?? '',
          pendingPaymentExpiryTime:
            result.pendingPaymentExpiryTime?.toISOString() ?? '',
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.logger.error(`Error processing request: ${error.message}`);
        this.handleError(error, callback);
      });
  }

  bookSession(
    call: ServerUnaryCall<BookSessionRequest, Session>,
    callback: sendUnaryData<Session>,
  ): void {
    this.bookSessionUseCase
      .execute({ slotId: call.request.slotId, userId: call.request.userId })
      .then((result) => {
        callback(null, {
          ...result,
          endTime: result.endTime.toISOString(),
          startTime: result.endTime.toISOString(),
          paymentId: result.paymentId === null ? '' : result.paymentId,
          pendingPaymentExpiryTime:
            result.pendingPaymentExpiryTime?.toISOString() || '',
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        });
      })
      .catch((error: Error) => {
        this.logger.error(`Error processing request: ${error.message}`);
        this.handleError(error, callback);
      });
  }

  private handleError<T>(error: Error, callback: sendUnaryData<T>) {
    if (error instanceof Exception) {
      const serviceError = {
        name: error.name,
        code: getGrpcStatusCode(error.code),
        message: error.message,
      };
      callback(serviceError, null);
    }
    const serviceError = {
      name: error.name,
      code: status.INTERNAL,
      message: 'Failed to process request',
    };
    callback(serviceError, null);
  }
}

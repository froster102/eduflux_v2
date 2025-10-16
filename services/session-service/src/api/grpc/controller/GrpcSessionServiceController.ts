import type {
  GetSessionRequest,
  Session,
  SessionServiceServer,
} from '@api/grpc/generated/session';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { GetSessionUseCase } from '@core/application/session/usecase/GetSessionUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Exception } from '@core/common/exception/Exception';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import {
  status,
  type sendUnaryData,
  type ServerUnaryCall,
} from '@grpc/grpc-js';

import { getGrpcStatusCode } from '@shared/errors/error-code';
import { inject } from 'inversify';

export class GrpcSessionServiceController implements SessionServiceServer {
  private logger: LoggerPort;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(SessionDITokens.BookSessionUseCase)
    private readonly getSessionUseCase: GetSessionUseCase,
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
            result.pendingPaymentExpiryTime!.toISOString(),
        };
        callback(null, response);
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

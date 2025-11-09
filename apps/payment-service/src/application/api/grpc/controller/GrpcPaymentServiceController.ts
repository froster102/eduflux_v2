import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentServiceServer,
} from '@eduflux-v2/shared/adapters/grpc/generated/payment';
import {
  status,
  type sendUnaryData,
  type ServerUnaryCall,
  type ServiceError,
} from '@grpc/grpc-js';
import { inject } from 'inversify';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { PaymentService } from '@payment/service/PaymentService';
import { getGrpcStatusCode } from '@eduflux-v2/shared/errors/error-code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class GrpcPaymentServiceController implements PaymentServiceServer {
  logger: LoggerPort;

  constructor(
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
    @inject(PaymentDITokens.PaymentService)
    private readonly paymentService: PaymentService,
  ) {
    this.logger = logger.fromContext(GrpcPaymentServiceController.name);
  }
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  createPayment(
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResponse>,
    callback: sendUnaryData<CreatePaymentResponse>,
  ): void {
    this.paymentService
      .createPayment(call.request)
      .then((response) => {
        callback(null, response);
      })
      .catch((error: Error | ServiceError) => {
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

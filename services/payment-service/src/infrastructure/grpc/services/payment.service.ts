import type { ILogger } from '@/shared/common/interface/logger.interface';
import type { IInitiatePaymentUseCase } from '@/application/use-cases/interface/initiate-payment.interface';
import { inject } from 'inversify';
import {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentServiceServer,
} from '../generated/payment';
import { TYPES } from '@/shared/di/types';
import {
  sendUnaryData,
  ServerUnaryCall,
  ServiceError,
  status,
} from '@grpc/grpc-js';
import { Currency } from '@/shared/constants/currency';
import { PaymentPurpose } from '@/domain/entities/transaction.entity';
import { DomainException } from '@/domain/exception/domain.exception';
import { getGrpcStatusCode } from '@/shared/error/error-code';
import { ApplicationException } from '@/application/exceptions/application.exception';

export class GrpcPaymentService implements PaymentServiceServer {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;
  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.InitiatePaymentUseCase)
    private readonly initialPaymentUseCase: IInitiatePaymentUseCase,
  ) {
    this.logger = logger.fromContext(GrpcPaymentService.name);
  }

  initiatePayment(
    call: ServerUnaryCall<InitiatePaymentRequest, InitiatePaymentResponse>,
    callback: sendUnaryData<InitiatePaymentResponse>,
  ): void {
    this.logger.info(`Received request for initiating payment.`);
    this.initialPaymentUseCase
      .execute({
        amount: call.request.amount,
        currency: call.request.currency as Currency,
        payerId: call.request.payerId,
        paymentPurpose: call.request.paymentPurpose as PaymentPurpose,
        metadata: call.request.metadata,
        successUrl: call.request.successUrl,
        cancelUrl: call.request.cancelUrl,
      })
      .then((initiatePaymentOutputDto) => {
        const response: InitiatePaymentResponse = {
          paymentId: initiatePaymentOutputDto.paymentId,
          checkoutUrl: initiatePaymentOutputDto.checkoutUrl,
        };
        callback(null, response);
      })
      .catch((error: Error | ServiceError) => {
        this.logger.error(
          `Error processing request to initiate payment error: ${error.message}`,
          error as Record<string, any>,
        );
        if (
          error instanceof ApplicationException ||
          error instanceof DomainException
        ) {
          const serviceError = {
            name: 'PaymentServiceError',
            code: getGrpcStatusCode(error.code!),
            message: error.message,
          };
          callback(serviceError, null);
        } else {
          const serviceError = {
            name: 'PaymentServiceError',
            code: status.INTERNAL,
            message: 'Failed to process request to initiate payment',
          };
          callback(serviceError, null);
        }
      });
  }
}

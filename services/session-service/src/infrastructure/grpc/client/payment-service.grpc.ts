import type { ILogger } from '@/shared/common/interface/logger.interface';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import { inject, injectable } from 'inversify';
import type {
  InitiatePaymentDto,
  InitiatePaymentResponseDto,
  IPaymentServiceGateway,
} from '@/application/ports/payment-service.gateway';
import {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentServiceClient,
} from '../generated/payment';
import { paymentGrpcServiceConfig } from '@/shared/config/payment-service.grpc.config';
import { TYPES } from '@/shared/di/types';
import { createClientLoggingInterceptor } from '../interceptors/client-logging.interceptor';

@injectable()
export class GrpcPaymentServiceClient implements IPaymentServiceGateway {
  private client: PaymentServiceClient;
  private address: string;

  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
    this.logger = logger.fromContext(GrpcPaymentServiceClient.name);
    this.address = paymentGrpcServiceConfig.GRPC_PAYMENT_SERVICE_URL;
    this.client = new PaymentServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC payment service client initialized, target:${this.address}`,
    );
  }

  initiatePayment(
    initiatePaymentDto: InitiatePaymentDto,
  ): Promise<InitiatePaymentResponseDto> {
    return new Promise((resolve, reject) => {
      const request: InitiatePaymentRequest = {
        amount: initiatePaymentDto.amount,
        currency: initiatePaymentDto.currency,
        payerId: initiatePaymentDto.payerId,
        paymentPurpose: initiatePaymentDto.paymentPurpose,
        paymentProvider: 'STRIPE',
        successUrl: initiatePaymentDto.successUrl,
        cancelUrl: initiatePaymentDto.cancelUrl,
        customerEmail: initiatePaymentDto.customerEmail! ?? '',
        metadata: initiatePaymentDto.metadata,
      };
      this.client.initiatePayment(
        request,
        (error: ServiceError | null, response: InitiatePaymentResponse) => {
          if (error) {
            this.logger.error(`Error initiating payment ${error.message}`);
            reject(error);
          }
          if (response) {
            resolve({
              checkoutUrl: response.checkoutUrl,
              paymentId: response.paymentId,
            });
          }
        },
      );
    });
  }
}

import {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentServiceClient,
} from '@api/grpc/generated/payment';
import type {
  InitiatePaymentDto,
  InitiatePaymentResponseDto,
  PaymentServicePort,
} from '@core/application/enrollment/port/gateway/PaymentServicePort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { credentials, type ServiceError } from '@grpc/grpc-js';
import { GrpcPaymentServiceConfig } from '@shared/config/GrpcPaymentServiceConfig';
import { inject } from 'inversify';

export class GrpcPaymentServiceAdapter implements PaymentServicePort {
  private client: PaymentServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcPaymentServiceAdapter.name);
    this.address = GrpcPaymentServiceConfig.GRPC_PAYMENT_SERVICE_URL;
    this.client = new PaymentServiceClient(
      this.address,
      credentials.createInsecure(),
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

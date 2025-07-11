import { Logger } from '@/shared/utils/logger';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { injectable } from 'inversify';
import {
  InitiatePaymentDto,
  InitiatePaymentResponseDto,
  IPaymentServiceGateway,
} from '@/application/ports/payment-service.gateway';
import {
  PaymentServiceClient,
  InitiatePaymentResponse,
  InitiatePaymentRequest,
} from '../generated/payment';
import { paymentGrpcServiceConfig } from '@/shared/config/payment-service.grpc.config';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';

@injectable()
export class GrpcPaymentServiceClient implements IPaymentServiceGateway {
  private client: PaymentServiceClient;
  private address: string;
  private logger = new Logger(ENROLLMENT_SERVICE);

  constructor() {
    this.address = paymentGrpcServiceConfig.GRPC_PAYMENT_SERVICE_URL;
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

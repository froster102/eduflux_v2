import { credentials, type ServiceError } from '@grpc/grpc-js';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import {
  PaymentServiceClient,
  type CreatePaymentRequest,
  type CreatePaymentResponse,
} from '@shared/adapters/grpc/generated/payment';
import { createClientLoggingInterceptor } from '@shared/adapters/grpc/interceptors/clientLoggingInterceptor';
import { CoreDITokens } from '@shared/di/CoreDITokens';
import { inject } from 'inversify';
import type { PaymentServicePort } from '@shared/ports/gateway/PaymentServicePort';
import type { GrpcPaymentServiceConfig } from '@shared/config/GrpcPaymentServiceConfig';

export class GrpcPaymentServiceAdapter implements PaymentServicePort {
  private readonly client: PaymentServiceClient;
  private readonly address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(CoreDITokens.GrpcPaymentServiceConfig)
    private readonly config: GrpcPaymentServiceConfig,
  ) {
    this.logger = logger.fromContext(GrpcPaymentServiceAdapter.name);
    this.address = this.config.GRPC_PAYMENT_SERVICE_URL;
    this.client = new PaymentServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC payment service client initialized, target: ${this.address}`,
    );
  }

  async createPayment(
    request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return new Promise((resolve, reject) => {
      this.client.createPayment(
        request,
        (
          error: ServiceError | null,
          response: CreatePaymentResponse | null,
        ) => {
          if (error) {
            this.logger.error(`Error creating payment: ${error.message}`);
            reject(new Error(error.message));
          } else if (response) {
            resolve(response);
          } else {
            reject(new Error('Empty response from PaymentService'));
          }
        },
      );
    });
  }
}

import { envVariables } from '@shared/validation/env-variables';

export class GrpcPaymentServiceConfig {
  static readonly GRPC_PAYMENT_SERVICE_URL =
    envVariables.GRPC_PAYMENT_SERVICE_URL;
}

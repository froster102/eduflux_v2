import { envVariables } from '@shared/env/envVariables';

export class GrpcPaymentServiceConfig {
  static readonly GRPC_PAYMENT_SERVICE_URL =
    envVariables.GRPC_PAYMENT_SERVICE_URL;
}

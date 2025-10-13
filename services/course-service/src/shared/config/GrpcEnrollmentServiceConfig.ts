import { envVariables } from '@shared/env/env-variables';

export class GrpcEnrollmentServiceConfig {
  static readonly GRPC_ENROLLMENT_SERVICE_URL =
    envVariables.GRPC_ENROLLMENT_SERVICE_URL;
}

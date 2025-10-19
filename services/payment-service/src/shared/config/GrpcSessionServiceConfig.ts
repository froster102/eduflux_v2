import { envVariables } from '@shared/env/env-variables';

export class GrpcSessionServiceConfig {
  static readonly GRPC_SESSION_SERVICE_URL =
    envVariables.GRPC_SESSION_SERVICE_URL;
}

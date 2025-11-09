import { envVariables } from '@shared/env/envVariables';

export class GrpcSessionServiceConfig {
  static readonly GRPC_SESSION_SERVICE_URL =
    envVariables.GRPC_SESSION_SERVICE_URL;
}

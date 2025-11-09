import { envVariables } from '@shared/env/env-variables';

export class GrpcServerConfig {
  static readonly GRPC_SERVER_PORT = envVariables.GRPC_SERVER_PORT;
}

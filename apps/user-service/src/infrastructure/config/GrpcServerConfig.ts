import { envVariables } from '@shared/env/env-variables';

export class GrpcServerConfig {
  static readonly PORT = envVariables.GRPC_SERVER_PORT;
}

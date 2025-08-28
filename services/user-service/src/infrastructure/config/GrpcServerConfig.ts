import { envVariables } from '@shared/validation/env-variables';

export class GrpcServerConfig {
  static readonly PORT = envVariables.GRPC_SERVER_PORT;
}

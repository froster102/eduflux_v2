import { envVariables } from '@shared/env/envVariables';

export class GrpcServerConfig {
  static readonly GRPC_SERVER_PORT = envVariables.GRPC_SERVER_PORT;
}

import { envVariables } from "@shared/env/env-variables";

export class GrpcUserServiceConfig {
  static readonly GRPC_USER_SERVICE_URL = envVariables.GRPC_USER_SERVICE_URL;
}

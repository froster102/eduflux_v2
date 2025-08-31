import { envVariables } from '@shared/validation/env-variables';

export class GrpcUserServiceConfig {
  static readonly GRPC_USER_SERVICE_URL = envVariables.GRPC_USER_SERVICE_URL;
}

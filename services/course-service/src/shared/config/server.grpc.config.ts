import { envVariables } from '@/shared/validation/env-variables';

export const grpcServerConfig = {
  PORT: envVariables.GRPC_SERVER_PORT,
};

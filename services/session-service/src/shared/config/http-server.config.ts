import { envVariables } from '@/shared/validation/env-variables';

export const httpServerConfig = {
  PORT: Number(envVariables.HTTP_SERVER_PORT),
  NODE_ENV: envVariables.NODE_ENV,
};

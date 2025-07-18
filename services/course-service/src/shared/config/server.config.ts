import { envVariables } from '@/shared/validation/env-variables';

export const serverConfig = {
  PORT: Number(envVariables.HTTP_SERVER_PORT),
  NODE_ENV: envVariables.NODE_ENV,
};

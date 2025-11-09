import { envVariables } from '@/validators/envVariables';

export const httpServerConfig = {
  PORT: envVariables.HTTP_SERVER_PORT,
  NODE_ENV: envVariables.NODE_ENV,
};

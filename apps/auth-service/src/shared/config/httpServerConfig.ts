import { envVariables } from '../env/env-variables';

export const httpServerConfig = {
  PORT: Number(envVariables.HTTP_SERVER_PORT),
  CLIENT_URL: envVariables.CLIENT_URL,
};

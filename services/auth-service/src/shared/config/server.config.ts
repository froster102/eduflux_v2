import { envVariables } from '../validation/env-variables';

export const serverConfig = {
  PORT: Number(envVariables.HTTP_SERVER_PORT),
  CLIENT_URL: envVariables.CLIENT_URL,
};

import { envVariables } from '@shared/env/env-variables';

export const serverConfig = {
  PORT: Number(envVariables.HTTP_SERVER_PORT),
  NODE_ENV: envVariables.NODE_ENV,
};

export class HttpServerConfig {
  static readonly PORT = envVariables.HTTP_SERVER_PORT;
  static readonly NODE_ENV = envVariables.NODE_ENV;
}

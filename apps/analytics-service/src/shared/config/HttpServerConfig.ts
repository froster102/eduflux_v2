import { envVariables } from '@shared/env/env-variables';

export class HttpServerConfig {
  static readonly HTTP_SERVER_PORT = envVariables.HTTP_SERVER_PORT;
  static readonly NODE_ENV = envVariables.NODE_ENV;
}


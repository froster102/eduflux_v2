import { envVariables } from '@shared/validation/env-variables';

export class HttpServerConfig {
  static readonly PORT = envVariables.HTTP_SERVER_PORT;
  static readonly NODE_ENV = envVariables.NODE_ENV;
}

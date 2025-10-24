import { envVariables } from '@shared/env/envVariables';

export class HttpServerConfig {
  static readonly PORT = envVariables.HTTP_SERVER_PORT;
  static readonly NODE_ENV = envVariables.NODE_ENV;
}

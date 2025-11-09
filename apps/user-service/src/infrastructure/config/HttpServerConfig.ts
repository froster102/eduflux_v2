import { envVariables } from '@shared/env/env-variables';

export class HttpServerConfig {
  static PORT = envVariables.HTTP_SERVER_PORT;
}

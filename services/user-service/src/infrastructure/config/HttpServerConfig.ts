import { envVariables } from '@shared/validation/env-variables';

export class HttpServerConfig {
  static PORT = envVariables.HTTP_SERVER_PORT;
}

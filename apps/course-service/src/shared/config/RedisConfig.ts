import type { RedisConfig as IRedisConfig } from '@eduflux-v2/shared/config/RedisConfig';
import { envVariables } from '@shared/env/env-variables';

export class RedisConfig implements IRedisConfig {
  REDIS_HOST: string = envVariables.REDIS_HOST;
  REDIS_PORT: number = envVariables.REDIS_PORT;
  REDIS_PASSWORD?: string = envVariables.REDIS_PASSWORD;
  REDIS_DB?: number = envVariables.REDIS_DB;
  REDIS_TLS?: boolean = envVariables.REDIS_TLS === 'true';
  REDIS_CONNECTION_TIMEOUT?: number = envVariables.REDIS_CONNECTION_TIMEOUT;
}


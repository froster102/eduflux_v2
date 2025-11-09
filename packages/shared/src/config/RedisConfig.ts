export interface RedisConfig {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  REDIS_DB?: number;
  REDIS_TLS?: boolean;
  REDIS_CONNECTION_TIMEOUT?: number;
}

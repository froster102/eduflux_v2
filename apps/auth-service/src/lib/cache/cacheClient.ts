import { RedisConfig } from '@/shared/config/reddisConfig';
import { logger } from '@/shared/utils/logger';
import { RedisCacheClientAdapter } from '@eduflux-v2/shared/adapters/cache/RedisCacheClientAdapter';

export const cacheClient = new RedisCacheClientAdapter(
  new RedisConfig(),
  logger,
);

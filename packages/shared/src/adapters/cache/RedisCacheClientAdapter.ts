import type { CacheClientPort } from '@shared/ports/cache/CacheClientPort';
import type { RedisConfig } from '@shared/config/RedisConfig';
import Redis from 'ioredis';
import { SharedConfigDITokens } from '@shared/di/SharedConfigDITokens';
import { inject } from 'inversify';
import { SharedCoreDITokens } from '@shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';

export class RedisCacheClientAdapter implements CacheClientPort {
  private client: Redis;
  private logger: LoggerPort;

  constructor(
    @inject(SharedConfigDITokens.RedisConfig) config: RedisConfig,
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(RedisCacheClientAdapter.name);
    this.client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db: config.REDIS_DB ?? 0,
      tls: config.REDIS_TLS ? {} : undefined,
      connectTimeout: config.REDIS_CONNECTION_TIMEOUT ?? 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      this.logger.info('Redis client connected');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error(`Error getting key ${key} from cache:`, error);
      return null;
    }
  }

  async set(
    key: string,
    value: string | number | object,
    ttlInSeconds?: number,
  ): Promise<void> {
    try {
      const serializedValue =
        typeof value === 'object' ? JSON.stringify(value) : String(value);

      if (ttlInSeconds) {
        await this.client.setex(key, ttlInSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting key ${key} in cache:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key} from cache:`, error);
      throw error;
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    try {
      await this.client.del(...keys);
    } catch (error) {
      console.error(`Error deleting keys from cache:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking existence of key ${key} in cache:`, error);
      return false;
    }
  }

  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, by);
    } catch (error) {
      console.error(`Error incrementing key ${key} in cache:`, error);
      throw error;
    }
  }

  async decrement(key: string, by: number = 1): Promise<number> {
    try {
      return await this.client.decrby(key, by);
    } catch (error) {
      console.error(`Error decrementing key ${key} in cache:`, error);
      throw error;
    }
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {
    try {
      await this.client.expire(key, ttlInSeconds);
    } catch (error) {
      console.error(`Error setting expiry for key ${key} in cache:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  async isBlocked(userId: string): Promise<boolean> {
    try {
      const result = await this.client.sismember('blocked:users', userId);
      return result === 1;
    } catch (error) {
      console.error(`Error checking if user ${userId} is blocked:`, error);
      // On error, default to not blocked to avoid blocking legitimate users
      return false;
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      await this.client.sadd('blocked:users', userId);
    } catch (error) {
      console.error(`Error blocking user ${userId}:`, error);
      throw error;
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      await this.client.srem('blocked:users', userId);
    } catch (error) {
      console.error(`Error unblocking user ${userId}:`, error);
      throw error;
    }
  }
}

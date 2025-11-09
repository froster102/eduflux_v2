export interface CacheClientPort {
  get<T>(key: string): Promise<T | null>;
  set(
    key: string,
    value: string | number | object,
    ttlInSeconds?: number,
  ): Promise<void>;
  delete(key: string): Promise<void>;
  deleteMany(keys: string[]): Promise<void>;
  exists(key: string): Promise<boolean>;
  increment(key: string, by?: number): Promise<number>;
  decrement(key: string, by?: number): Promise<number>;
  expire(key: string, ttlInSeconds: number): Promise<void>;
  clear(): Promise<void>;
  isBlocked(userId: string): Promise<boolean>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}

import type { AsyncLocalStorage } from 'node:async_hooks';

export interface LoggerConfig {
  serviceName: string;
  environment: string;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  timezone?: string;
  enableCorrelationId?: boolean;
  asyncLocalStorage?: AsyncLocalStorage<Map<string, any>>;
}

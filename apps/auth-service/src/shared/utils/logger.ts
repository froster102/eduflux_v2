import { AUTH_SERVICE } from '@/shared/constants/services';
import { envVariables } from '@/shared/env/env-variables';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';

const config: LoggerConfig = {
  environment: envVariables.NODE_ENV,
  serviceName: AUTH_SERVICE,
  enableCorrelationId: true,
};
export const logger = new WinstonLoggerAdapter(config);

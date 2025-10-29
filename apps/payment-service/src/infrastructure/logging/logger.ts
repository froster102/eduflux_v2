import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { PAYMENT_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/env/env-variables';
import { asyncLocalStorage } from '@shared/utils/async-store';

const config: LoggerConfig = {
  environment: envVariables.NODE_ENV,
  serviceName: PAYMENT_SERVICE,
  asyncLocalStorage: asyncLocalStorage,
  enableCorrelationId: true,
};

export const logger = new WinstonLoggerAdapter(config);

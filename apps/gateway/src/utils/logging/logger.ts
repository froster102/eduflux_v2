import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';
import { asyncLocalStorage } from '@gateway/utils/async-store/asyncStore';
import { GATEWAY } from '@gateway/utils/constants/service';
import { envVariables } from '@gateway/utils/env/envVariables';

const config: LoggerConfig = {
  environment: envVariables.NODE_ENV,
  serviceName: GATEWAY,
  asyncLocalStorage: asyncLocalStorage,
  enableCorrelationId: true,
};
export const logger = new WinstonLoggerAdapter(config);

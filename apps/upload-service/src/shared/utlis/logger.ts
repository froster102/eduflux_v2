import { UPLOAD_SERVICE } from '@/shared/constants/services';
import { asyncLocalStorage } from '@/shared/utlis/async-store';
import { envVariables } from '@/validators/envVariables';
import { WinstonLoggerAdapter } from '@eduflux-v2/shared/adapters/logger/WinstonLoggerAdapter';
import type { LoggerConfig } from '@eduflux-v2/shared/config/LoggerConfig';

const config: LoggerConfig = {
  environment: envVariables.NODE_ENV,
  serviceName: UPLOAD_SERVICE,
  asyncLocalStorage: asyncLocalStorage,
  enableCorrelationId: true,
};

export const logger = new WinstonLoggerAdapter(config);

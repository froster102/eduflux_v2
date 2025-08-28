import type { LoggerPort } from '@core/common/port/LoggerPort';
import { USER_SERVICE } from '@shared/constants/services';
import { asyncLocalStorage } from '@shared/utils/store';
import { envVariables } from '@shared/validation/env-variables';
import { unmanaged } from 'inversify';
import winston from 'winston';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devConsoleFormat = printf(
  ({ level, message, timestamp, correlationId, context, ...info }) => {
    const meta = Object.keys(info).length ? JSON.stringify(info, null, 2) : '';
    const correlationPart = correlationId ? `[${correlationId as string}]` : '';
    return `[${USER_SERVICE}] [${timestamp as string}] ${correlationPart} [${(context as string) ?? USER_SERVICE}] ${level.toUpperCase()}: ${message as string} ${meta}`;
  },
);

export class WinstonLogger implements LoggerPort {
  private _logger: winston.Logger;
  private _context?: string;

  constructor(@unmanaged() context?: string) {
    this._context = context;

    const isDevelopment = envVariables.NODE_ENV === 'development';

    this._logger = winston.createLogger({
      level: isDevelopment ? 'debug' : 'info',
      levels: winston.config.npm.levels,
      format: combine(
        winston.format((info) => {
          info.context = this._context || info.context;
          const store = asyncLocalStorage.getStore();

          if (store && store.has('correlationId')) {
            info.correlationId = store.get('correlationId');
            info.application = USER_SERVICE;
            info.enviroment = envVariables.NODE_ENV;
          }
          return info;
        })(),
        isDevelopment
          ? timestamp({ format: this.istTimestampFormat() })
          : timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        isDevelopment ? devConsoleFormat : this.prodJsonFormat,
        isDevelopment ? colorize({ all: true }) : winston.format.uncolorize(),
      ),
      transports: [
        new winston.transports.Console({
          format: isDevelopment ? undefined : this.prodJsonFormat,
        }),
      ],
      exitOnError: false,
    });
  }

  private istTimestampFormat() {
    return new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      // hour12: false,
    });
  }

  private prodJsonFormat = combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true }),
    json(),
  );

  info(message: string, context?: Record<string, unknown>): void {
    this._logger.info(message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this._logger.error(message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this._logger.warn(message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this._logger.debug(message, context);
  }

  fromContext(contextName: string): LoggerPort {
    return new WinstonLogger(contextName);
  }
}

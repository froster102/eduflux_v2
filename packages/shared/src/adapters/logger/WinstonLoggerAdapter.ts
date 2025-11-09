import type { LoggerConfig } from '@shared/config/LoggerConfig';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import winston from 'winston';
import 'reflect-metadata';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

export class WinstonLoggerAdapter implements LoggerPort {
  private logger: winston.Logger;
  private context?: string;
  private config: LoggerConfig;

  constructor(config: LoggerConfig, context?: string) {
    this.context = context;
    this.config = config;
    const isDevelopment = config.environment;

    this.logger = winston.createLogger({
      level: isDevelopment ? 'debug' : 'info',
      levels: winston.config.npm.levels,
      format: combine(
        winston.format((info) => {
          info.context = this.context || info.context;
          const store = config.asyncLocalStorage?.getStore();
          if (store && store.has('correlationId')) {
            info.correlationId = store.get('correlationId');
          }
          info.enviroment = config.environment;
          info.service = config.serviceName;
          return info;
        })(),
        isDevelopment
          ? timestamp({ format: this.istTimestampFormat() })
          : timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        isDevelopment ? this.devConsoleFormat : this.prodJsonFormat,
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
      hour12: false,
    });
  }

  private devConsoleFormat = printf(
    ({
      level,
      message,
      timestamp,
      correlationId,
      context,
      service,
      ...meta
    }) => {
      const metastring = Object.keys(meta).length
        ? JSON.stringify(meta, null, 2)
        : '';
      const correlationPart = correlationId
        ? `[${correlationId as string}]`
        : '';
      return `[${service as string}] [${timestamp as string}] ${correlationPart} [${(context as string) ?? (service as string)}] ${level.toUpperCase()}: ${message as string} ${metastring}`;
    },
  );

  private prodJsonFormat = combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true }),
    json(),
  );

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(message, context);
  }

  fromContext(contextName: string): LoggerPort {
    return new WinstonLoggerAdapter(this.config, contextName);
  }
}

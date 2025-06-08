import * as winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(
  ({ level, message, timestamp, context, ...info }) => {
    const meta = Object.keys(info).length ? JSON.stringify(info, null, 2) : '';
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    return `[${timestamp}] [${context ?? 'App'}] ${level}: ${message} ${meta}`;
  },
);

export class Logger {
  private _logger: winston.Logger;
  private _context: string;

  constructor(context?: string) {
    this._context = context;

    this._logger = winston.createLogger({
      level: 'info',
      levels: winston.config.npm.levels,
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format((info) => {
          info.context = this._context;
          return info;
        })(),
        customFormat,
      ),
      transports: [new winston.transports.Console()],
    });
  }

  info(message: string, meta: Record<string, unknown> = {}) {
    this._logger.info(message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}) {
    this._logger.error(message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}) {
    this._logger.warn(message, meta);
  }

  debug(message: string, meta: Record<string, unknown> = {}) {
    this._logger.debug(message, meta);
  }

  log(level: string, message: string, meta: Record<string, unknown> = {}) {
    this._logger.log(level, message, meta);
  }
}

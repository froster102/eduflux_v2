export interface LoggerPort {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown> | Error): void;
  warn(message: string, context?: Record<string, unknown> | Error): void;
  debug(message: string, context?: Record<string, unknown> | Error): void;
  fromContext(contextName: string): LoggerPort;
}

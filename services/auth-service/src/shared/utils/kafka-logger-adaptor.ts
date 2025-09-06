import { type LogEntry, logLevel } from 'kafkajs';
import { Logger } from './logger';

const logger = new Logger('KAFKA_JS');

const kafkaLogLevelToWinston: Record<string, string> = {
  [logLevel.ERROR]: 'error',
  [logLevel.WARN]: 'warn',
  [logLevel.INFO]: 'info',
  [logLevel.DEBUG]: 'debug',
};

export const kafkaLogCreator = (): ((entry: LogEntry) => void) => {
  return ({ namespace, level, log }) => {
    const { message, ...meta } = log;
    const winstonLevel = kafkaLogLevelToWinston[level];

    logger.log(winstonLevel, `[${namespace}] ${message}`);
  };
};

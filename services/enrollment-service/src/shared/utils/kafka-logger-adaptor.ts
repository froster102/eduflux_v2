import type { ILogger } from '../common/interface/logger.interface';
import { LogEntry, logLevel } from 'kafkajs';
import { container } from '../di/container';
import { TYPES } from '../di/types';

function getLogger() {
  if (container) {
    return container.get<ILogger>(TYPES.Logger).fromContext('KAFKA');
  }
}
const kafkaLogLevelToWinston: Record<number, keyof ILogger> = {
  [logLevel.ERROR]: 'error',
  [logLevel.WARN]: 'warn',
  [logLevel.INFO]: 'info',
  [logLevel.DEBUG]: 'debug',
};

export const kafkaLogCreator = (): ((entry: LogEntry) => void) => {
  return ({ namespace, level, log }) => {
    const { message, ...meta } = log;
    const winstonLevel = kafkaLogLevelToWinston[level];

    let combinedMeta = {};

    if (typeof getLogger()![winstonLevel] === 'function') {
      combinedMeta = {
        namespace,
        ...meta,
      };

      if (winstonLevel === 'error' && meta.error instanceof Error) {
        getLogger()!.error(message, combinedMeta);
      } else {
        getLogger()![winstonLevel](message, combinedMeta);
      }
    } else {
      getLogger()!.warn(
        `Unknown Kafka log level: ${level}. Message: [${namespace}] ${message}`,
        combinedMeta,
      );
    }
  };
};

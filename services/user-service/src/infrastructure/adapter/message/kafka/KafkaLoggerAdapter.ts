import { type LogEntry, logLevel } from 'kafkajs';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { container } from '@application/di/RootModule';
import type { LoggerPort } from '@core/common/port/LoggerPort';

function getLogger() {
  if (container) {
    return container.get<LoggerPort>(CoreDITokens.Logger).fromContext('KAFKA');
  }
}
const kafkaLogLevelToWinston: Record<number, keyof LoggerPort> = {
  [logLevel.ERROR]: 'error',
  [logLevel.WARN]: 'warn',
  [logLevel.INFO]: 'info',
  [logLevel.DEBUG]: 'debug',
};

export class KafkaLoggerAdapter {
  public static new(): (level: logLevel) => (entry: LogEntry) => void {
    return (level) => {
      return ({ namespace, log }) => {
        const { message, ...meta } = log;
        const winstonLevel = kafkaLogLevelToWinston[level];

        const logger = getLogger();

        let combinedMeta = {};

        if (typeof logger![winstonLevel] === 'function') {
          combinedMeta = {
            namespace,
            ...meta,
          };

          if (winstonLevel === 'error' && meta.error instanceof Error) {
            logger!.error(message, combinedMeta);
          } else {
            logger![winstonLevel](message, combinedMeta);
          }
        } else {
          logger!.warn(
            `Unknown Kafka log level: ${level}. Message: [${namespace}] ${message}`,
            combinedMeta,
          );
        }
      };
    };
  }
}

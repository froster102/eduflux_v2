import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { logLevel, type LogEntry } from 'kafkajs';
import { container } from 'src/di/RootModule';

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

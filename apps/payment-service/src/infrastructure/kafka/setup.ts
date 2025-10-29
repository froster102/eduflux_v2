import { container } from '@application/di/RootModule';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { PAYMENT_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/env/env-variables';
import { Kafka, type Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: PAYMENT_SERVICE,
  brokers: [envVariables.KAKFA_BROKER_URL],
});

export const producer: Producer = kafka.producer();

producer.on('producer.connect', () => {
  const logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('KAFKA');
  logger.debug('Kafka producer connected successfully');
});

import { kafkaConfig } from '@/shared/config/kafka.config';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { kafkaLogCreator } from '@/shared/utils/kafka-logger-adaptor';
import { Logger } from '@/shared/utils/logger';
import { tryCatch } from '@/shared/utils/try-catch';
import { Kafka } from 'kafkajs';

const logger = new Logger(AUTH_SERVICE);

export const kafka = new Kafka({
  clientId: kafkaConfig.CLIENT_ID,
  brokers: kafkaConfig.BROKERS,
  logCreator: kafkaLogCreator,
});

export const kafkaProducer = kafka.producer();

export async function connectKafkaProducer(): Promise<void> {
  const { error } = await tryCatch(kafkaProducer.connect());

  if (error) {
    logger.error(`Failed to connect Kafka producer ${error.message}`);
    throw error;
  }

  logger.info('Kafka producer connected successfully.');
}

export async function disconnectKafkaProducer(): Promise<void> {
  const { error } = await tryCatch(kafkaProducer.disconnect());

  if (error) {
    logger.error(`Error disconnecting Kafka producer`);
  }

  logger.info('Kafka producer disconnected.');
}

import { kafkaConfig } from '@/shared/config/kafka.config';
import { KafkaLoggerAdapter } from '@/shared/utils/KafkaLoggerAdapter';
import { logger } from '@/shared/utils/logger';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: kafkaConfig.CLIENT_ID,
  brokers: kafkaConfig.BROKERS,
  logCreator: KafkaLoggerAdapter.new(),
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

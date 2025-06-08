import { kafkaConfig } from '@/shared/config/kafka.config';
import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: kafkaConfig.CLIENT_ID,
  brokers: kafkaConfig.BROKERS,
  connectionTimeout: 3000,
  requestTimeout: 25000,
});

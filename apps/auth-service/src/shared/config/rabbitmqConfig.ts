import { envVariables } from '@/shared/env/env-variables';
import type { RabbitMQConnectionSettings } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqConnectionSettings';

export const rabbitMQConfig: RabbitMQConnectionSettings = {
  username: envVariables.RABBITMQ_USER,
  password: envVariables.RABBITMQ_PASSWORD,
  vhost: envVariables.RABBITMQ_VHOST,
  connection: {
    secure: envVariables.RABBITMQ_SECURE === 'true',
    hostname: envVariables.RABBITMQ_HOST,
    port: envVariables.RABBITMQ_PORT,
  },
  maxRetries: envVariables.RABBITMQ_MAX_RETRIES,
};

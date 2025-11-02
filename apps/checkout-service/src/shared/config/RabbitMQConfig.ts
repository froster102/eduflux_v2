import type { RabbitMQConnectionSettings } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMqConnectionSettings';
import { envVariables } from '@shared/env/envVariables';

export class RabbitMQConfig implements RabbitMQConnectionSettings {
  username: string = envVariables.RABBITMQ_USER;
  password: string = envVariables.RABBITMQ_PASSWORD;
  vhost: string = envVariables.RABBITMQ_VHOST;
  connection: {
    secure: boolean;
    hostname: string;
    port: number;
  } = {
    secure: envVariables.RABBITMQ_SECURE === 'true' ? true : false,
    hostname: envVariables.RABBITMQ_HOST,
    port: envVariables.RABBITMQ_PORT,
  };
  maxRetries: number = envVariables.RABBITMQ_MAX_RETRIES;
}


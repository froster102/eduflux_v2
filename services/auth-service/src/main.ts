import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { KafkaEventPublisher } from './infrastructure/messaging/kafka/producer/kafka-event.publisher';
import { TYPES } from './shared/di/types';

const server = new Server(serverConfig.PORT);

async function bootstrap() {
  try {
    const kafkaEventPublisher = container.get<KafkaEventPublisher>(
      TYPES.EventPublisher,
    );
    await kafkaEventPublisher.connect();

    server.start();
  } catch (error) {
    console.error(`Failed to start the server:`, error);
    process.exit(1);
  }
}

void bootstrap();

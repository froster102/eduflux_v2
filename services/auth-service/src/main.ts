import 'reflect-metadata';
import { startServer } from './http/server';
import { connectKafkaProducer } from './messaging/kafka/kafka';
import { tryCatch } from './shared/utils/try-catch';

async function boostrap(): Promise<void> {
  startServer();

  const { error: kafkaProducerConnectionError } = await tryCatch(
    connectKafkaProducer(),
  );

  if (kafkaProducerConnectionError) {
    process.exit(1);
  }
}

void boostrap();

import 'reflect-metadata';
import { startServer } from './http/server';
import { tryCatch } from './shared/utils/try-catch';
import { UserEventsConsumer } from './messaging/kafka/consumers/user-events.consumer';

async function boostrap(): Promise<void> {
  startServer();

  const userEventsConsumer = new UserEventsConsumer();
  const { error: userEventsConsumerError } = await tryCatch(
    userEventsConsumer.connect(),
  );

  if (userEventsConsumerError) {
    process.exit(1);
  }
}

void boostrap();

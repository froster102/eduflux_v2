import 'reflect-metadata';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { startServer } from '@/http/server';
import { UserEventsConsumer } from '@/messaging/kafka/consumers/UserEventsConsumer';

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

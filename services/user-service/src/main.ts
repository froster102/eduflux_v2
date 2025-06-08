import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { TYPES } from './shared/di/types';
import { DatabaseClient } from './infrastructure/database/setup';
import { UserEventsConsumer } from './interface/consumers/user-events.consumer';

async function bootstrap() {
  const server = new Server(serverConfig.PORT);

  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  const userEventsConsumer = container.get<UserEventsConsumer>(
    TYPES.UserEventsConsumer,
  );

  await userEventsConsumer.connect();

  server.start();
}

void bootstrap();

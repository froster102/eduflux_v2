import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { container } from './shared/di/container';
import { DatabaseClient } from './infrastructure/database/setup';
import { TYPES } from './shared/di/types';
import { httpServerConfig } from './shared/config/http-server.config';

async function bootstrap() {
  //http
  const httpServer = new Server(httpServerConfig.PORT);
  httpServer.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();
}

void bootstrap();

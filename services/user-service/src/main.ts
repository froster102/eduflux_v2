import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { TYPES } from './shared/di/types';
import { DatabaseClient } from './infrastructure/database/setup';
import { UserEventsConsumer } from './interface/consumers/user-events.consumer';
import { GrpcServer } from './infrastructure/grpc/grpc.server';

async function bootstrap() {
  //http
  const server = new Server(serverConfig.PORT);
  server.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  //kafka consumer
  const userEventsConsumer = container.get<UserEventsConsumer>(
    TYPES.UserEventsConsumer,
  );
  await userEventsConsumer.connect();

  //grpc
  const grpcServer = container.get<GrpcServer>(TYPES.GrpcServer);
  grpcServer.start();
}

void bootstrap();

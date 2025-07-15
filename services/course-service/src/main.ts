import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { DatabaseClient } from './infrastructure/database/setup';
import { TYPES } from './shared/di/types';
import { GrpcServer } from './infrastructure/grpc/grpc.server';
import { EnrollmentEventsConsumer } from './interface/consumer/enrollment-events.consumer';

async function bootstrap() {
  //http
  const httpServer = new Server(serverConfig.PORT);
  httpServer.start();

  //gRPC
  const grpcServer = new GrpcServer();
  grpcServer.start();

  //kafka consumer
  const enrollmentEventsConsumer = container.get<EnrollmentEventsConsumer>(
    TYPES.EnrollmentEventsConsumer,
  );
  await enrollmentEventsConsumer.connect();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();
}

void bootstrap();

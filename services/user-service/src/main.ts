import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { TYPES } from './shared/di/types';
import { DatabaseClient } from './infrastructure/database/setup';
import { GrpcServer } from './infrastructure/grpc/grpc.server';
import { EnrollmentEventsConsumer } from './interface/consumers/enrollment-events.consumer';
import { IMessageBrokerGatway } from './application/ports/message-broker.gateway';

async function bootstrap() {
  //http
  const server = new Server(serverConfig.PORT);
  server.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  //kafka producer
  const kafkaProducer = container.get<IMessageBrokerGatway>(
    TYPES.MessageBrokerGateway,
  );
  await kafkaProducer.connect();

  //kafka consumer
  const enrollmentEventsConsumer = container.get<EnrollmentEventsConsumer>(
    TYPES.EnrollmentEventsConsumer,
  );
  await enrollmentEventsConsumer.connect();

  //grpc
  const grpcServer = container.get<GrpcServer>(TYPES.GrpcServer);
  grpcServer.start();
}

void bootstrap();

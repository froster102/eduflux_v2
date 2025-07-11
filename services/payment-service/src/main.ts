import 'reflect-metadata';
import type { IMessageBrokerGatway } from './application/ports/message-broker.gateway';
import { serverConfig } from './shared/config/server.config';
import { container } from './shared/di/container';
import { TYPES } from './shared/di/types';
import { DatabaseClient } from './infrastructure/database/setup';
import { GrpcServer } from './infrastructure/grpc/grpc.server';
import { Server } from './infrastructure/http/http.server';

async function bootstrap() {
  //http
  const server = new Server(serverConfig.PORT);
  server.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  // kafka producer
  const kafkaProducer = container.get<IMessageBrokerGatway>(
    TYPES.MessageBrokerGateway,
  );
  await kafkaProducer.connect();

  //grpc
  const grpcServer = new GrpcServer();
  grpcServer.start();
}

void bootstrap();

import 'reflect-metadata';
import { container } from './shared/di/container';
import { TYPES } from './shared/di/types';
import { Server } from './infrastructure/http/http.server';
import { serverConfig } from './shared/config/server.config';
import { DatabaseClient } from './infrastructure/database/setup';
import { PaymentEventsConsumer } from './interface/consumer/payment-events.consumer';
import { GrpcServer } from './infrastructure/grpc/grpc.server';

async function bootstrap() {
  //http
  const server = new Server(serverConfig.PORT);
  server.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  //Grpc server
  const grpcServer = new GrpcServer();
  grpcServer.start();

  // kafka consumers
  const kafkaConsumer = container.get<PaymentEventsConsumer>(
    TYPES.PaymentEventsConsumer,
  );
  await kafkaConsumer.connect();

  process.on('SIGTERM', () => {
    void (async () => await kafkaConsumer.disconnect())();
  });

  process.on('SIGINT', () => {
    void (async () => {
      await kafkaConsumer.disconnect();
      process.exit(0);
    })();
  });
}

void bootstrap();

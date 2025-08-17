import 'reflect-metadata';
import { Server } from './infrastructure/http/server';
import { container } from './shared/di/container';
import { DatabaseClient } from './infrastructure/database/setup';
import { TYPES } from './shared/di/types';
import { httpServerConfig } from './shared/config/http-server.config';
import type { ICronServices } from './infrastructure/cron/interface/cron-services.interface';
import { PaymentEventsConsumer } from './interface/consumer/payment-events.consumer';

async function bootstrap() {
  //http
  const httpServer = new Server(httpServerConfig.PORT);
  httpServer.start();

  //database
  const databaseClient = container.get<DatabaseClient>(TYPES.DatabaseClient);
  await databaseClient.connect();

  //Consumers
  const kafkaConsumer = container.get<PaymentEventsConsumer>(
    TYPES.PaymentEventsConsumer,
  );
  await kafkaConsumer.connect();

  //Cron services
  const cronServices = container.get<ICronServices>(TYPES.CronServices);

  cronServices.register();
}

void bootstrap();

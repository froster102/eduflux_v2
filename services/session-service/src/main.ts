import 'reflect-metadata';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { HttpServer } from '@api/http-rest/HttpServer';
import { container } from '@di/RootModule';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';

async function bootstrap() {
  //http
  const httpServer = new HttpServer();
  httpServer.start();

  //database
  await MongooseConnection.connect();

  //Consumers
  const kafkaConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaConsumer.connect();

  //Cron services
  const cronServices = container.get<ICronServices>(
    InfrastructureDITokens.CronServices,
  );

  cronServices.register();
}

void bootstrap();

import 'reflect-metadata';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { HttpServer } from '@api/http-rest/HttpServer';
import { container } from '@di/RootModule';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducerAdapter';
import { CoreDITokens } from '@core/common/di/CoreDITokens';

async function bootstrap() {
  //database
  await MongooseConnection.connect();

  //Kafka producer
  const kafkaProducer = container.get<KafkaEventBusProducerAdapter>(
    CoreDITokens.EventBus,
  );
  await kafkaProducer.connect();

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

  //http
  const httpServer = new HttpServer();
  httpServer.start();
}

void bootstrap();

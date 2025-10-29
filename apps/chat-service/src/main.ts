import 'reflect-metadata';
import { HttpServer } from '@api/http/HttpServer';
import { container } from '@di/RootModule';
import type { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/kafka/KafkaEventBusProducerAdapter';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';

async function bootstrap() {
  //database
  const mongooseConnection = container.get<MongooseConnection>(
    InfrastructureDITokens.MongooseConnection,
  );
  await mongooseConnection.connect();

  //kafka producer
  const kafkaProducer = container.get<KafkaEventBusProducerAdapter>(
    CoreDITokens.EventBus,
  );
  await kafkaProducer.connect();

  //kafka consumer
  const kafkaConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaConsumer.run();
  //http
  const server = new HttpServer();
  server.start();
}

void bootstrap();

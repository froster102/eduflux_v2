import "reflect-metadata";
import { HttpServer } from "@api/http-rest/HttpServer";
import { MongooseConnection } from "@infrastructure/adapter/persistence/mongoose/MongooseConnection";
import { container } from "@di/RootModule";
import type { KafkaEventBusProducerAdapter } from "@infrastructure/adapter/kafka/KafkaEventBusProducerAdapter";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { KafkaEventsConsumer } from "@api/consumer/KafkaEventsConsumer";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";

async function bootstrap() {
  //database
  await MongooseConnection.connect();

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

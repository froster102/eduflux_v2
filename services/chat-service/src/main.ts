import "reflect-metadata";
import { HttpServer } from "@api/http-rest/HttpServer";
import { MongooseConnection } from "@infrastructure/adapter/persistence/mongoose/MongooseConnection";
import { container } from "@di/RootModule";
import type { KafkaEventBusProducerAdapter } from "@infrastructure/adapter/kafka/KafkaEventBusProducerAdapter";
import { CoreDITokens } from "@core/common/di/CoreDITokens";

async function bootstrap() {
  //database
  await MongooseConnection.connect();

  //kafka produer
  const kafkaProducer = container.get<KafkaEventBusProducerAdapter>(
    CoreDITokens.EventBus,
  );
  await kafkaProducer.connect();

  //http
  const server = new HttpServer();
  server.start();
}

void bootstrap();

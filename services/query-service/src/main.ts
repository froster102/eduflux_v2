import "reflect-metadata";
import { HttpServer } from "@api/http-rest/HttpServer";
import { MongooseConnection } from "@infrastructure/adapter/persistence/mongoose/MongooseConnection";
import { container } from "@di/RootModule";
import type { KafkaEventsConsumer } from "@api/consumers/KafkaEventsConsumer";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";

async function bootstrap() {
  //database
  await MongooseConnection.connect();

  //Consumers
  const kafkaConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaConsumer.run();

  //http
  const httpServer = new HttpServer();
  httpServer.start();
}

void bootstrap();

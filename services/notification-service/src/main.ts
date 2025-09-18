import type { KafkaEventsConsumer } from "@api/consumers/KafkaEventsConsumer";
import { HttpServer } from "@api/http/HttpServer";
import { container } from "@di/RootModule";
import { MongooseConnection } from "@infrastructure/adapter/persistence/mongoose/MongooseConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";

async function bootstrap() {
  //http
  const server = new HttpServer();
  server.start();

  //database
  await MongooseConnection.connect();

  //kafka consumer
  const kafkaConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaConsumer.run();
}

void bootstrap();

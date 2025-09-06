import "reflect-metadata";
import { HttpServer } from "@api/http-rest/HttpServer";
import { MongooseConnection } from "@infrastructure/adapter/persistence/mongoose/MongooseConnection";

async function bootstrap() {
  //http
  const server = new HttpServer();
  server.start();

  //database
  await MongooseConnection.connect();

  //Grpc server
  // const grpcServer = new GrpcServer();
  // grpcServer.start();

  //kafka produer
  // const kafkaEventBusConnection = container.get<KafkaEventBusConnection>(
  //   InfrastructureDITokens.KafkaEventBusConnection,
  // );
  // await kafkaEventBusConnection.connectProducer();
}

void bootstrap();

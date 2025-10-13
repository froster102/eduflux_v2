import 'reflect-metadata';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import { container } from '@di/RootModule';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { HttpServer } from '@api/http-rest/HttpServer';
import { GrpcServer } from '@infrastructure/adapter/grpc/GrpcServer';

async function bootstrap() {
  //database
  await MongooseConnection.connect();

  //Consumers
  // const kafkaConsumer = container.get<KafkaEventsConsumer>(
  //   InfrastructureDITokens.KafkaEventsConsumer,
  // );
  // await kafkaConsumer.run();

  //http
  const httpServer = new HttpServer();
  httpServer.start();

  //gRPC
  const grpcServer = new GrpcServer();
  grpcServer.start();
}

void bootstrap();

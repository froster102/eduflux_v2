import type { KafkaEventsConsumer } from '@api/consumer/KafkaPaymentEventsConsumer';
import { GrpcServer } from '@api/grpc/GrpcServer';
import { HttpServer } from '@api/http-rest/HttpServer';
import { container } from '@di/RootModule';
import type { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import 'reflect-metadata';

async function bootstrap() {
  //http
  const server = new HttpServer();
  server.start();

  //database
  await MongooseConnection.connect();

  //Grpc server
  const grpcServer = new GrpcServer();
  grpcServer.start();

  //kafka produer
  const kafkaEventBusConnection = container.get<KafkaEventBusConnection>(
    InfrastructureDITokens.KafkaEventBusConnection,
  );
  await kafkaEventBusConnection.connectProducer();

  // kafka consumer
  const kafkaEventsConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaEventsConsumer.connect();
}

void bootstrap();

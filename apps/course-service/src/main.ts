import 'reflect-metadata';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import { container } from '@di/RootModule';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { HttpServer } from '@api/http/HttpServer';
import { GrpcServer } from '@api/grpc/GrpcServer';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducer';

async function bootstrap() {
  //database
  await MongooseConnection.connect();

  //Consumers
  const kafkaConsumer = container.get<KafkaEventsConsumer>(
    InfrastructureDITokens.KafkaEventsConsumer,
  );
  await kafkaConsumer.run();

  //kafka produer
  const kafkaProducer = container.get<KafkaEventBusProducerAdapter>(
    CoreDITokens.EventBus,
  );
  await kafkaProducer.connect();

  //http
  const httpServer = new HttpServer();
  httpServer.start();

  //gRPC
  const grpcServer = new GrpcServer();
  grpcServer.start();
}

void bootstrap();

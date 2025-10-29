import 'reflect-metadata';
import type { KafkaEventsConsumer } from '@api/consumer/KafkaEventsConsumer';
import { HttpServer } from '@api/http/HttpServer';
import { container } from '@di/RootModule';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { KafkaEventBusProducerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaEventBusProducerAdapter';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { GrpcServer } from '@api/grpc/GrpcServer';

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
  await kafkaConsumer.run();

  //Cron services
  const cronServices = container.get<ICronServices>(
    InfrastructureDITokens.CronServices,
  );

  cronServices.register();

  //gRPC server
  const grpcServer = new GrpcServer();
  grpcServer.start();

  //http
  const httpServer = new HttpServer();
  httpServer.start();
}

void bootstrap();

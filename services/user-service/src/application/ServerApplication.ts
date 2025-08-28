import type { KafkaEventsConsumer } from '@application/api/consumers/KafkaEventsConsumer';
import { GrpcServer } from '@application/api/grpc/GrpcServer';
import { HttpServer } from '@application/api/http-rest/HttpServer';
import { container } from '@application/di/RootModule';
import { KafkaEventBusConnection } from '@infrastructure/adapter/message/kafka/KafkaConnection';
import { MongooseConnection } from '@infrastructure/adapter/persistence/mongoose/MongooseConnection';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';

export class ServerApplication {
  runHttpServer() {
    const server = new HttpServer();
    server.start();
  }

  runGrpcServer() {
    const grpcServer = new GrpcServer();
    grpcServer.start();
  }

  async connectDatabase() {
    await MongooseConnection.connect();
  }

  async connectKafkaProducer() {
    const kafkaEventBusConnection = container.get<KafkaEventBusConnection>(
      InfrastructureDITokens.KafkaEventBusConnection,
    );
    await kafkaEventBusConnection.connectProducer();
  }

  async connectKafkaConsumers() {
    const kafkaEventsConsumer = container.get<KafkaEventsConsumer>(
      InfrastructureDITokens.KafkaEventsConsumer,
    );
    await kafkaEventsConsumer.connect();
  }

  async run(): Promise<void> {
    await this.connectDatabase();
    this.runHttpServer();
    this.runGrpcServer();
    await this.connectKafkaProducer();
    await this.connectKafkaConsumers();
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}

import { HttpServer } from '@application/api/http/HttpServer';
import type { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import { container } from '@application/di/RootModule';
import type { MongooseConnection } from '@eduflux-v2/shared/infrastructure/database/mongoose/MongooseConnection';
import { GrpcServer } from '@application/api/grpc/GrpcServer';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';

export class ServerApplication {
  runHttpServer() {
    const server = new HttpServer(HttpServerConfig.HTTP_SERVER_PORT);
    server.start();
  }

  async run(): Promise<void> {
    await this.connectDatabase();
    await this.connectRabbitMQ();
    this.runGrpcServer();
    this.runHttpServer();
  }

  async connectDatabase() {
    const mongooseConnection = container.get<MongooseConnection>(
      SharedInfrastructureDITokens.MongooseConnection,
    );
    await mongooseConnection.connect();
  }

  async connectRabbitMQ() {
    const rabbitMqConnection = container.get<RabbitMqConnection>(
      SharedInfrastructureDITokens.RabbitMQConnection,
    );
    await rabbitMqConnection.connect();
  }

  runGrpcServer() {
    const grpcServer = new GrpcServer(GrpcServerConfig.GRPC_SERVER_PORT);
    grpcServer.start();
  }

  static new(): ServerApplication {
    return new ServerApplication();
  }
}

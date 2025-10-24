import { HttpServer } from '@application/api/http/HttpServer';
import { MongooseConnection } from '@infrastructure/database/mongoose/MongooseConnection';
import { producer } from '@infrastructure/kafka/setup';

export class ServerApplication {
  runHttpServer() {
    const server = new HttpServer();
    server.start();
  }

  async connectDatabase() {
    await MongooseConnection.connect();
  }

  async connectKafkaProducer() {
    return producer.connect();
  }

  async run(): Promise<void> {
    await this.connectDatabase();
    await this.connectKafkaProducer();
    this.runHttpServer();
  }

  static new(): ServerApplication {
    return new ServerApplication();
  }
}

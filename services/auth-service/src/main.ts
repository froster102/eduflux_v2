import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';

const server = new Server(serverConfig.PORT);

function bootstrap() {
  try {
    server.start();
  } catch (error) {
    console.error(`Failed to start the server:`, error);
    process.exit(1);
  }
}

bootstrap();

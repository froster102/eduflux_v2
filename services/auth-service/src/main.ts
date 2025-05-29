import { Server } from './infrastructure/http/server';
import { serverConfig } from './shared/config/server.config';

const server = new Server(serverConfig.PORT);

try {
  server.start();
} catch (error) {
  console.error(error);
}

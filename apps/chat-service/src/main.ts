import 'reflect-metadata';
import { ChatService } from 'src/ChatService';

try {
  new ChatService().start().catch((error: Error) => {
    console.error(`Error starting ChatService: ${error?.message}`);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting ChatService: ${error?.message}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

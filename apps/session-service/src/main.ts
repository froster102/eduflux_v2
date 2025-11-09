import 'reflect-metadata';
import { SessionService } from 'src/SessionService';

try {
  new SessionService().start().catch((error: Error) => {
    console.error(`Error starting SessionService: ${error?.message}`);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting SessionService: ${error?.message}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

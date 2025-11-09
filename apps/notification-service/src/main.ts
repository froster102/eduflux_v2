import 'reflect-metadata';
import { NotificationService } from 'src/NotificationService';

try {
  new NotificationService().start().catch((error: Error) => {
    console.error(`Error starting NotificationService: ${error?.message}`);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting NotificationService: ${error?.message}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

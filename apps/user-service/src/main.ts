import 'reflect-metadata';
import { UserService } from 'src/UserService';

try {
  new UserService().start().catch((error: Error) => {
    handleError(error);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting UserService: ${error?.message}`, error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

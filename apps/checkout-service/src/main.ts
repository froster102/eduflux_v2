import 'reflect-metadata';
import { CheckoutService } from 'src/CheckoutService';

try {
  new CheckoutService().start().catch((error: Error) => {
    handleError(error);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting CheckoutService: ${error?.message}`, error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);


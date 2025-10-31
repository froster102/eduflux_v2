import 'reflect-metadata';
import { AuthService } from '@/AuthService';
import { logger } from '@/shared/utils/logger';

try {
  new AuthService().start().catch((error: Error) => {
    logger.error(`Error starting AuthService: ${error?.message}`);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  logger.error(`Error starting AuthService: ${error?.message}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

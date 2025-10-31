import 'reflect-metadata';
import { CourseService } from 'src/CourseService';

try {
  new CourseService().start().catch((error: Error) => {
    handleError(error);
    process.exit(1);
  });
} catch (error) {
  handleError(error as Error);
}

function handleError(error: Error) {
  console.error(`Error starting CourseService: ${error?.message}`, error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

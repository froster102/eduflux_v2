import { Exception } from './Exception';

export class DatabaseException extends Exception<void> {
  constructor(message?: string) {
    super({
      codeDescription: {
        code: 'DATABASE_ERROR',
        message: message || 'Database operation failed',
      },
    });
  }
}

import { BaseException } from '@/shared/exception/base.exception';

export class DatabaseException extends BaseException {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR');
    this.name = 'DatabaseException';
  }
}

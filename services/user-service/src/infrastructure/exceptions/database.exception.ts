import { BaseException } from '@/shared/exceptions/base.exception';

export class DatabaseException extends BaseException {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR');
    this.name = 'DatabaseException';
  }
}

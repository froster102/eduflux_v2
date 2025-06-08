import { DomainException } from './domain.exception';

export class DatabaseException extends DomainException {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR');
    this.name = 'DatabaseException';
  }
}

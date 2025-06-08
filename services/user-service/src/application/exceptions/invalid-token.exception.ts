import { ApplicationException } from './application.exception';

export class InvalidTokenException extends ApplicationException {
  constructor(message: string) {
    super(message, 'INVALID_TOKEN');
    this.name = 'InvalidTokenException';
  }
}

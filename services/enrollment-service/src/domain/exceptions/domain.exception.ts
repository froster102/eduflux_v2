import { BaseException } from '@/shared/exception/base.exception';

export class DomainException extends BaseException {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}

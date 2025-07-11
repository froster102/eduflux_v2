import { BaseException } from '@/shared/exception/base.exception';

export class StripeException extends BaseException {
  constructor(message: string) {
    super(message, 'STRIPE_ERRO');
    this.name = 'StripeException';
  }
}

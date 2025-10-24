import { Code } from '@shared/common/error/Code';
import { Exception } from '@shared/common/exception/Exception';

export class StripeWebhookException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: Code.INTERNAL_ERROR,
      overrideMessage: message,
    });
  }
}

import { Code } from '@core/common/error/Code';
import { Exception } from './Exception';

export class ConflictException extends Exception<void> {
  constructor(message: string) {
    super({ codeDescription: Code.CONFLICT_ERROR, overrideMessage: message });
  }
}

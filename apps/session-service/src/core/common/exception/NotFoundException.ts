import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class NotFoundException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.NOT_FOUND_ERROR, overrideMessage: message });
    this.name = 'NotFoundException';
  }
}

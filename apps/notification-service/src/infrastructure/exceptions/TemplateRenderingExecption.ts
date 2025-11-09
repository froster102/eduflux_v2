import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class TemplateRenderingException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.INTERNAL_ERROR, overrideMessage: message });
  }
}

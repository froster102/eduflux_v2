import { Code } from "@core/common/error/Code";
import { Exception } from "@core/common/exception/Exception";

export class TemplateRenderingException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.INTERNAL_ERROR, overrideMessage: message });
  }
}

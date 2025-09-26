import { Code } from "@core/common/error/Code";
import { Exception } from "@core/common/exception/Exception";

export class ForbiddenException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.FORBIDDEN_ERROR, overrideMessage: message });
    this.name = "ForbiddenException";
  }
}

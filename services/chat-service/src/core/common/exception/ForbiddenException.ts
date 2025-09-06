import { Code } from "@core/common/error/Code";
import { Exception } from "@core/common/exception/Exception";

export class ForbiddenException extends Exception<void> {
  constructor() {
    super({
      codeDescription: Code.FORBIDDEN_ERROR,
      overrideMessage: "User not authroized for this action.",
    });
  }
}

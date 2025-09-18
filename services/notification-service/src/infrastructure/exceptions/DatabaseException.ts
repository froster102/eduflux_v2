import { Exception } from "@core/common/exception/Exception";

export class DatabaseException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: {
        code: "DATABASE_ERROR",
        message: message,
      },
    });
  }
}

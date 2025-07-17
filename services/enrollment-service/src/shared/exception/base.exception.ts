export class BaseException extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public publicMessage?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.publicMessage = publicMessage;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

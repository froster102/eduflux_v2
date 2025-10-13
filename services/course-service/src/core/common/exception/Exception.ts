import type { CodeDescription } from '@core/common/error/Code';
import type { Optional } from '@core/common/types/CommonTypes';

export type CreateExceptionPayload<TData> = {
  codeDescription: CodeDescription;
  overrideMessage?: string;
  data?: TData;
};

export abstract class Exception<TData> extends Error {
  public readonly code: string;
  public readonly data: Optional<TData>;
  constructor(payload: CreateExceptionPayload<TData>) {
    super(payload.overrideMessage || payload.codeDescription.message);
    this.code = payload.codeDescription.code;
    this.message = payload.overrideMessage || payload.codeDescription.message;
    this.data = payload.data;

    Error.captureStackTrace(this, this.constructor);
  }
}

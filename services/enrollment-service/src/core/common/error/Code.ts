export type CodeDescription = {
  code: string;
  message: string;
};

export class Code {
  public static VALIDATION_ERROR: CodeDescription = {
    code: 'VALIDATION_ERROR',
    message: 'Validation error',
  };
  public static BAD_REQUEST_ERROR: CodeDescription = {
    code: 'BAD_REQUEST_ERROR',
    message: 'Invalid request.',
  };
  public static NOT_FOUND_ERROR: CodeDescription = {
    code: 'NOT_FOUND_ERROR',
    message: 'Resource not found.',
  };
  public static UNAUTHORIZED_ERROR: CodeDescription = {
    code: 'UNAUTHORIZED_ERROR',
    message: 'Access denied.',
  };
  public static CONFLICT_ERROR: CodeDescription = {
    code: 'CONFLICT_ERROR',
    message: 'Resource already exists.',
  };
  public static INTERNAL_ERROR: CodeDescription = {
    code: 'INTERNAL_ERROR',
    message: 'Internal error',
  };
}

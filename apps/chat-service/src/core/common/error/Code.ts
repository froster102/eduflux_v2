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
    message: 'Unauthorized',
  };
  public static CONFLICT_ERROR: CodeDescription = {
    code: 'CONFLICT_ERROR',
    message: 'Resource already exists.',
  };
  public static FORBIDDEN_ERROR: CodeDescription = {
    code: 'FORBIDDEN_ERROR',
    message: 'Access denied.',
  };
  public static INTERNAL_ERROR: CodeDescription = {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error has occured, please try again later',
  };
}

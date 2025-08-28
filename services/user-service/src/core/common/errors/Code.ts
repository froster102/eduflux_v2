export type CodeDescription = {
  code: string;
  message: string;
};

export class Code {
  public static BAD_REQUEST_ERROR: CodeDescription = {
    code: 'BAD_REQUEST_ERROR',
    message: 'Bad request.',
  };

  public static UNAUTHORIZED_ERROR: CodeDescription = {
    code: 'UNAUTHORIZED_ERROR',
    message: 'Unauthorized error.',
  };

  public static WRONG_CREDENTIALS_ERROR: CodeDescription = {
    code: 'WRONG_CREDENTIALS_ERROR',
    message: 'Wrong credentials.',
  };

  public static ACCESS_DENIED_ERROR: CodeDescription = {
    code: 'ACCESS_DENIED_ERROR',
    message: 'Access denied.',
  };

  public static INTERNAL_ERROR: CodeDescription = {
    code: 'INTERNAL_ERROR',
    message: 'Internal error.',
  };

  public static ENTITY_NOT_FOUND_ERROR: CodeDescription = {
    code: 'ENTITY_NOT_FOUND_ERROR',
    message: 'The requested resource was not found.',
  };

  public static ENTITY_ALREADY_EXISTS_ERROR: CodeDescription = {
    code: 'ENTITY_ALREADY_EXISTS_ERROR',
    message: 'The requested resource already exists.',
  };

  public static ENTITY_VALIDATION_ERROR: CodeDescription = {
    code: 'ENTITY_VALIDATION_ERROR',
    message: 'Entity validation error.',
  };
}

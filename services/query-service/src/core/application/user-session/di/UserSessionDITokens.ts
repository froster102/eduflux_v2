export class UserSessionDITokens {
  //Use-cases
  static readonly GetUserSessionsUseCase: unique symbol = Symbol(
    "GetUserSessionsUseCase",
  );

  //Handler
  static readonly ConfirmSessionEventHandler: unique symbol = Symbol(
    "ConfirmSessionEventHandler",
  );

  //Repository
  static readonly UserSessionRepository: unique symbol = Symbol(
    "UserSessionRepository",
  );

  //Controller
  static readonly UserSessionController: unique symbol = Symbol(
    "UserSessionController",
  );
}

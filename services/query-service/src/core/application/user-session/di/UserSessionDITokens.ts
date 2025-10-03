export class UserSessionDITokens {
  //Use-cases
  static readonly GetUserSessionsUseCase: unique symbol = Symbol(
    "GetUserSessionsUseCase",
  );

  //Handler
  static readonly ConfirmSessionEventHandler: unique symbol = Symbol(
    "ConfirmSessionEventHandler",
  );
  static readonly UserSessionUpdatedEventHandler: unique symbol = Symbol(
    "UserSessionUpdatedEventHandler",
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

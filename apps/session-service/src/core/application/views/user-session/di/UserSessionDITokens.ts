export class UserSessionDITokens {
  //Use-cases
  static readonly GetUserSessionsUseCase: unique symbol = Symbol(
    'GetUserSessionsUseCase',
  );

  //Subscribers
  static readonly SessionConfirmedEventSubscriber: unique symbol = Symbol(
    'SessionConfirmedEventSubscriber',
  );
  static readonly UserSessionUpdatedEventSubscriber: unique symbol = Symbol(
    'UserSessionUpdatedEventSubscriber',
  );
  static readonly UserUpdatedEventSubscriber: unique symbol = Symbol(
    'UserUpdatedEventSubscriber',
  );

  //Repository
  static readonly UserSessionRepository: unique symbol = Symbol(
    'UserSessionRepository',
  );

  //Controller
  static readonly UserSessionController: unique symbol = Symbol(
    'UserSessionController',
  );
}

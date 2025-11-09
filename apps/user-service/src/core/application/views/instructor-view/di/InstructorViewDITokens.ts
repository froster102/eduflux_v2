export class InstructorViewDITokens {
  //Use-cases
  static readonly GetInstructorViewsUseCase: unique symbol = Symbol(
    'GetInstructorViewsUseCase',
  );
  static readonly GetInstructorViewUseCase: unique symbol = Symbol(
    'GetInstructorViewUseCase',
  );

  //Subscribers
  static readonly InstructorStatsUpdatedEventSubscriber: unique symbol = Symbol(
    'InstructorStatsUpdatedEventSubscriber',
  );
  static readonly SessionSettingsUpdatedEventSubscriber: unique symbol = Symbol(
    'SessionSettingsUpdatedEventSubscriber',
  );
  static readonly InstructorCreatedEventSubscriber: unique symbol = Symbol(
    'InstructorCreatedEventSubscriber',
  );
  static readonly UserUpdatedEventSubscriber: unique symbol = Symbol(
    'UserUpdatedEventSubscriber',
  );

  //Repository
  static readonly InstructorViewRepository: unique symbol = Symbol(
    'InstructorViewRepository',
  );

  //Controller
  static readonly InstructorViewController: unique symbol = Symbol(
    'InstructorViewController',
  );
}

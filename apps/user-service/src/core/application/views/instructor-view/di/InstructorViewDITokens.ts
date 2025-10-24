export class InstructorViewDITokens {
  //Use-cases
  static readonly GetInstructorViewsUseCase: unique symbol = Symbol(
    'GetInstructorViewsUseCase',
  );
  static readonly GetInstructorViewUseCase: unique symbol = Symbol(
    'GetInstructorViewUseCase',
  );

  //Hanlders
  static readonly InstructorStatsUpdatedEventHandler: unique symbol = Symbol(
    'InstructorStatsUpdatedEventHandler',
  );
  static readonly SessionSettingsUpdatedEventHandler: unique symbol = Symbol(
    'SessionSettingsUpdatedEventHandler',
  );
  static readonly InstructorCreatedEventHandler: unique symbol = Symbol(
    'InstructorCreatedEventHandler',
  );
  static readonly UserUpdatedEventHandler: unique symbol = Symbol(
    'UserUpdatedEventHandler',
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

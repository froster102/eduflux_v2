export class InstructorViewDITokens {
  //Use-cases
  static readonly GetInstructorViewsUseCase: unique symbol = Symbol(
    "GetInstructorViewsUseCase",
  );
  static readonly GetInstructorViewUseCase: unique symbol = Symbol(
    "GetInstructorViewUseCase",
  );
  static readonly SessionUpdatedEventHandler: unique symbol = Symbol(
    "SessionUpdatedEventHandler",
  );

  //Hanlders
  static readonly InstructorStatsEventHandler: unique symbol = Symbol(
    "InstructorStatsEventHandler",
  );
  static readonly SessionSettingsEventHandler: unique symbol = Symbol(
    "SessionSettingsEventHandler",
  );
  static readonly InstructorCreatedEventHandler: unique symbol = Symbol(
    "InstructorCreatedEventHandler",
  );

  //Repository
  static readonly InstructorViewRepository: unique symbol = Symbol(
    "InstructorViewRepository",
  );

  //Controller
  static readonly InstructorViewController: unique symbol = Symbol(
    "InstructorViewController",
  );
}

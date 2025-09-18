export class SessionSettingsDITokens {
  //Use-cases
  static readonly GetInstructorSessionSettingsUseCase: unique symbol = Symbol(
    'GetInstructorSessionSettingsUseCase',
  );
  static readonly UpadteInstructorSessionSettingsUseCase: unique symbol =
    Symbol('UpadteInstructorSessionSettingsUseCase');
  static readonly EnableSessionUseCase: unique symbol = Symbol(
    'EnableSessionUseCase',
  );

  //Repostitory
  static readonly SessionSettingsRepository: unique symbol = Symbol(
    'SessionSettingsRepository',
  );

  //Controller
  static readonly SessionSettingsController: unique symbol = Symbol(
    'SessionSettingsController',
  );
}

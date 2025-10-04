export class LearnerStatsDITokens {
  static readonly GetLearnerStatsUseCase: unique symbol = Symbol(
    'GetLearnerStatsUseCase',
  );
  static readonly LearnerStatsRepository: unique symbol = Symbol(
    'LearnerStatsRepository',
  );
  static readonly EnrollmentSuccessEventHandler: unique symbol = Symbol(
    'EnrollmentSuccessEventHandler',
  );
  static readonly SessionUpdatedEventHandler: unique symbol = Symbol(
    'SessionUpdatedEventHandler',
  );
}

export class LearnerStatsDITokens {
  static readonly GetLearnerStatsUseCase: unique symbol = Symbol(
    'GetLearnerStatsUseCase',
  );
  static readonly LearnerStatsRepository: unique symbol = Symbol(
    'LearnerStatsRepository',
  );
  static readonly EnrollmentCompletedEventHandler: unique symbol = Symbol(
    'EnrollmentSuccessEventHandler',
  );
  static readonly SessionCompletedEventHandler: unique symbol = Symbol(
    'SessionCompletedEventHandler',
  );
}

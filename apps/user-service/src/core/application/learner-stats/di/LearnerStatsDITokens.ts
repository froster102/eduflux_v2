export class LearnerStatsDITokens {
  static readonly GetLearnerStatsUseCase: unique symbol = Symbol(
    'GetLearnerStatsUseCase',
  );
  static readonly LearnerStatsRepository: unique symbol = Symbol(
    'LearnerStatsRepository',
  );
  static readonly EnrollmentCompletedEventSubscriber: unique symbol = Symbol(
    'EnrollmentCompletedEventSubscriber',
  );
  static readonly SessionCompletedEventSubscriber: unique symbol = Symbol(
    'SessionCompletedEventSubscriber',
  );
}

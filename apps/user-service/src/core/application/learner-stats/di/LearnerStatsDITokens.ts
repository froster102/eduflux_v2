export class LearnerStatsDITokens {
  static readonly GetLearnerStatsUseCase: unique symbol = Symbol(
    'GetLearnerStatsUseCase',
  );
  static readonly LearnerStatsRepository: unique symbol = Symbol(
    'LearnerStatsRepository',
  );
  static readonly EnrollmentCreatedEventSubscriber: unique symbol = Symbol(
    'EnrollmentCreatedEventSubscriber',
  );
  static readonly SessionCompletedEventSubscriber: unique symbol = Symbol(
    'SessionCompletedEventSubscriber',
  );
}

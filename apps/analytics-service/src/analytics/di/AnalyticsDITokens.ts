export class AnalyticsDITokens {
  //Service
  static readonly AnalyticsService: unique symbol = Symbol('AnalyticsService');

  //Controller
  static readonly AnalyticsController: unique symbol = Symbol(
    'AnalyticsController',
  );

  //Repository
  static readonly ApplicationStatsRepository: unique symbol = Symbol(
    'ApplicationStatsRepository',
  );
  static readonly UserGrowthSnapshotRepository: unique symbol = Symbol(
    'UserGrowthSnapshotRepository',
  );

  //Subscribers
  static readonly UserCreatedEventSubscriber: unique symbol = Symbol(
    'UserCreatedEventSubscriber',
  );
  static readonly InstructorCreatedEventSubscriber: unique symbol = Symbol(
    'InstructorCreatedEventSubscriber',
  );
  static readonly CoursePublishedEventSubscriber: unique symbol = Symbol(
    'CoursePublishedEventSubscriber',
  );
  static readonly PaymentSuccessfullEventSubscriber: unique symbol = Symbol(
    'PaymentSuccessfullEventSubscriber',
  );
}


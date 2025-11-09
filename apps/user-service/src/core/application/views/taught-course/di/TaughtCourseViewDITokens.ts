export class TaughtCourseViewDITokens {
  //Use-cases
  static readonly GetTaughtCourseViewUseCase: unique symbol = Symbol(
    'GetTaughtCourseViewUseCase',
  );

  //Subscribers
  static readonly CoursePublishedEventSubscriber: unique symbol = Symbol(
    'CoursePublishedEventSubscriber',
  );
  static readonly CourseCreatedEventSubscriber: unique symbol = Symbol(
    'CourseCreatedEventSubscriber',
  );
  static readonly CourseUpdatedEventSubscriber: unique symbol = Symbol(
    'CourseUpdatedEventSubscriber',
  );

  //Repository
  static readonly TaughtCourseViewRepository: unique symbol = Symbol(
    'TaughtCourseViewRepository',
  );
}

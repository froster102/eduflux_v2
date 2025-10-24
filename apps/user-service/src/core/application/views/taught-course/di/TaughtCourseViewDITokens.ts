export class TaughtCourseViewDITokens {
  //Use-cases
  static readonly GetTaughtCourseViewUseCase: unique symbol = Symbol(
    'GetTaughtCourseViewUseCase',
  );

  //Handler
  static readonly CoursePublishedEventHandler: unique symbol = Symbol(
    'CoursePublishedEventHandler',
  );
  static readonly CourseCreatedEventHandler: unique symbol = Symbol(
    'CourseCreatedEventHandler',
  );
  static readonly CourseUpdatedEventHandler: unique symbol = Symbol(
    'CourseUpdatedEventHandler',
  );

  //Repository
  static readonly TaughtCourseViewRepository: unique symbol = Symbol(
    'TaughtCourseViewRepository',
  );
}

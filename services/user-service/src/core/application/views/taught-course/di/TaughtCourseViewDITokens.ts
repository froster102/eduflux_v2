export class TaughtCourseViewDITokens {
  //Use-cases
  static readonly CourseCreatedEventHandler: unique symbol = Symbol(
    'CourseCreatedEventHandler',
  );
  static readonly CourseUpdatedEventHandler: unique symbol = Symbol(
    'CourseUpdatedEventHandler',
  );
  static readonly GetTaughtCourseViewUseCase: unique symbol = Symbol(
    'GetTaughtCourseViewUseCase',
  );

  //Repository
  static readonly TaughtCourseViewRepository: unique symbol = Symbol(
    'TaughtCourseViewRepository',
  );
}

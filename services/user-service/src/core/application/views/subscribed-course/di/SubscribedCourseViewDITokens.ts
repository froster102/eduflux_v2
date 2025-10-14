export class SubscribedCourseViewDITokens {
  //Use-cases
  static readonly GetSubscribedCourseViewsUseCase: unique symbol = Symbol(
    'GetSubscribedCourseViewsUseCase',
  );

  //Repository
  static readonly SubscribedCourseViewRepository: unique symbol = Symbol(
    'SubscribedCourseViewRepository',
  );
}

export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol("Logger");

  //external service
  static readonly CourseService: unique symbol = Symbol("CourseService");
  static readonly UserService: unique symbol = Symbol("UserService");
}

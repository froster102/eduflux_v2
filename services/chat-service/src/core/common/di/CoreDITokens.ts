export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol("Logger");
  static readonly CourseService: unique symbol = Symbol("CourseService");
  static readonly UserService: unique symbol = Symbol("UserService");

  static readonly EventBus: unique symbol = Symbol("EventBus");
}

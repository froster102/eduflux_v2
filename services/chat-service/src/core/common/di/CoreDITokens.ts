export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol("Logger");
  static readonly EnrollmentService: unique symbol =
    Symbol("EnrollmentService");
  static readonly UserService: unique symbol = Symbol("UserService");

  static readonly EventBus: unique symbol = Symbol("EventBus");
}

export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol("Logger");

  static readonly EventBus: unique symbol = Symbol("EventBus");

  //External service
  static readonly UserService: unique symbol = Symbol("UserService");
}

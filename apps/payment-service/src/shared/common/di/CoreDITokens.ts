export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol('Logger');

  static readonly EventBus: unique symbol = Symbol('EventBus');

  //Unit of work
  static readonly UnitOfWork: unique symbol = Symbol('UnitOfWork');
}

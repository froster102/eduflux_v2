export class ConfigDITokens {
  static readonly Logger: unique symbol = Symbol('Logger');

  static readonly EventBus: unique symbol = Symbol('EventBus');

  //Unit of work
  static readonly UnitOfWork: unique symbol = Symbol('UnitOfWork');

  //External service
  static readonly UserService: unique symbol = Symbol('UserService');
  static readonly CourseService: unique symbol = Symbol('CourseService');
  static readonly SessionService: unique symbol = Symbol('SessionService');
  static readonly PaymentService: unique symbol = Symbol('PaymentService');

  static readonly MongooseConnection: unique symbol =
    Symbol('MongooseConnection');
}

export class SharedCoreDITokens {
  static readonly Logger: unique symbol = Symbol('Logger');

  //Unit of work
  static readonly UnitOfWork: unique symbol = Symbol('UnitOfWork');

  //Message broker
  static readonly MessageBroker: unique symbol = Symbol('MessageBroker');

  //External service
  static readonly UserService: unique symbol = Symbol('UserService');
  static readonly CourseService: unique symbol = Symbol('CourseService');
  static readonly SessionService: unique symbol = Symbol('SessionService');
  static readonly PaymentService: unique symbol = Symbol('PaymentService');
}

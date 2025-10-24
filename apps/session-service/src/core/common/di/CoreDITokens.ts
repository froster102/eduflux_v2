export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol('Logger');

  static readonly EventBus: unique symbol = Symbol('EventBus');

  //Unit of work
  static readonly UnitOfWork: unique symbol = Symbol('UnitOfWork');

  //Domain services
  static readonly SessionBookingService: unique symbol = Symbol(
    'SessionBookingService',
  );
  static readonly SlotGenerationService: unique symbol = Symbol(
    'SlotGenerationService',
  );

  //External service
  static readonly UserService: unique symbol = Symbol('UserService');
  static readonly PaymentService: unique symbol = Symbol('PaymentService');
}

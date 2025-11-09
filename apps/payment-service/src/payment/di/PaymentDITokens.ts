export class PaymentDITokens {
  //Service
  static readonly PaymentService: unique symbol = Symbol('PaymentService');
  static readonly StripeService: unique symbol = Symbol('StripeService');

  //Repository
  static readonly PaymentRepository: unique symbol =
    Symbol('PaymentRepository');

  //Controller
  static readonly PaymentController: unique symbol =
    Symbol('PaymentController');

  //gRPC Controller
  static readonly GrpcPaymentServiceController: unique symbol = Symbol(
    'GrpcPaymentServiceController',
  );

  //External service
  static readonly CourseService: unique symbol = Symbol('CourseService');
  static readonly SessionService: unique symbol = Symbol('SessionService');
}

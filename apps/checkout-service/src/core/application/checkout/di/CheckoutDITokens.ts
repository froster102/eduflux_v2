export class CheckoutDITokens {
  //Use-cases
  static readonly HandleCheckoutUseCase: unique symbol = Symbol.for(
    'HandleCheckoutUseCase',
  );

  //Subscribers
  static readonly PaymentSuccessfullEventSubscriber: unique symbol = Symbol.for(
    'PaymentSuccessfullEventSubscriber',
  );

  //Controller
  static readonly CheckoutController: unique symbol =
    Symbol.for('CheckoutController');
}

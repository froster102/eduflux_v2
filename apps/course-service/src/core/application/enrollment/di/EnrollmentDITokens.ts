export class EnrollmentDITokens {
  //Use-cases
  static readonly CreateEnrollmentUseCase: unique symbol = Symbol(
    'CreateEnrollmentUseCase',
  );
  static readonly VerifyChatAccessUseCase: unique symbol = Symbol(
    'VerifyChatAccessUseCase',
  );
  static readonly GetEnrollmentUseCase: unique symbol = Symbol(
    'GetEnrollmentUseCase',
  );

  //Repositories
  static readonly EnrollmentRepository: unique symbol = Symbol(
    'EnrollmentRepository',
  );

  //Subscribers
  static readonly EnrollmentPaymentSuccessfullEventSubscriber: unique symbol =
    Symbol('EnrollmentPaymentSuccessfullEventSubscriber');

  //Controller
  static readonly EnrollmentController: unique symbol = Symbol(
    'EnrollmentController',
  );
}

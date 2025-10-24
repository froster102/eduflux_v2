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

  //Handlers
  static readonly EnrollmentPaymentSuccessfullEventHandler: unique symbol =
    Symbol('EnrollmentPaymentSuccessfullEventHandler');

  //Controller
  static readonly EnrollmentController: unique symbol = Symbol(
    'EnrollmentController',
  );
}

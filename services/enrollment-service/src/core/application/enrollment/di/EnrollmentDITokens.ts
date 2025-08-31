export class EnrollmentDITokens {
  //Use-cases
  static readonly CompleteEnrollmentUseCase: unique symbol = Symbol(
    'CompleteEnrollmentUseCase',
  );
  static readonly CreateEnrollmentUseCase: unique symbol = Symbol(
    'CreateEnrollmentUseCase',
  );
  static readonly CheckUserEnrollmentUseCase: unique symbol = Symbol(
    'CheckUserEnrollmentUseCase',
  );
  static readonly GetUserEnrollmentsUseCase: unique symbol = Symbol(
    'GetUserEnrollmentsUseCase',
  );
  static readonly VerifyChatAccessUseCase: unique symbol = Symbol(
    'VerifyChatAccessUseCase',
  );

  //Repositories
  static readonly EnrollmentRepository: unique symbol = Symbol(
    'EnrollmentRepository',
  );

  static readonly EnrollmentController: unique symbol = Symbol(
    'EnrollmentController',
  );

  //External Service
  static readonly UserService: unique symbol = Symbol('UserService');
  static readonly CourseService: unique symbol = Symbol('CourseService');
  static readonly PaymentService: unique symbol = Symbol('PaymentService');
}

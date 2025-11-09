export class EnrollmentDITokens {
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
  static readonly CreateEnrollmentSubsciber: unique symbol = Symbol(
    'CreateEnrollmentSubsciber',
  );
}

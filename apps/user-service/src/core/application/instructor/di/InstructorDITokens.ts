export class InstructorDITokens {
  //Use-case
  static readonly GetInstructorsUseCase: unique symbol = Symbol(
    'GetInstructorsUseCase',
  );
  static readonly GetInstructorUseCase: unique symbol = Symbol(
    'GetInstructorUseCase',
  );

  //Repository
  static readonly InstructorRepository: unique symbol = Symbol(
    'InstructorRepository',
  );
}

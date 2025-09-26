export class InstructorDITokens {
  //Use-case
  static readonly GetInstructorsUseCase: unique symbol = Symbol(
    'GetInstructorsUseCase',
  );

  //Repository
  static readonly InstructorRepository: unique symbol = Symbol(
    'InstructorRepository',
  );
}

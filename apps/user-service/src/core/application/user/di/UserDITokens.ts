export class UserDITokens {
  //Use-cases
  static readonly CreateUserUseCase: unique symbol =
    Symbol('CreateUserUseCase');
  static readonly GetUserUseCase: unique symbol = Symbol('GetUserUseCase');
  static readonly UpdateUserUseCase: unique symbol =
    Symbol('UpdateUserUseCase');
  static readonly GetUsersUseCase: unique symbol = Symbol('GetUsersUseCase');
  static readonly BecomeInstructorUseCase: unique symbol = Symbol(
    'BecomeInstructorUseCase',
  );

  //Controller
  static readonly UserController: unique symbol = Symbol('UserController');

  //Repositories
  static readonly UserRepository: unique symbol = Symbol('UserRepository');
}

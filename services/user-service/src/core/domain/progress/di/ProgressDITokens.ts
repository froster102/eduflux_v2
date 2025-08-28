export class ProgressDITokens {
  //Repositories
  public static readonly ProgressRepository: unique symbol =
    Symbol('ProgressRepository');

  // Use-cases
  public static readonly AddToProgressUseCase: unique symbol = Symbol(
    'AddToProgressUseCase',
  );
  public static readonly CreateProgressUseCase: unique symbol = Symbol(
    'CreateProgressUseCase',
  );
  public static readonly GetProgressUseCase: unique symbol =
    Symbol('GetProgressUseCase');
  public static readonly RemoveFromProgressUseCase: unique symbol = Symbol(
    'RemoveFromProgressUseCase',
  );

  //Controller
  public static readonly ProgressController: unique symbol =
    Symbol('ProgressController');
}

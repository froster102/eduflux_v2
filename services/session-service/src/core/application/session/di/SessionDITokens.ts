export class SessionDITokens {
  //Use-cases
  static readonly ConfirmSessionBookingUseCase: unique symbol = Symbol(
    'ConfirmSessionBookingUseCase',
  );
  static readonly BookSessionUseCase: unique symbol =
    Symbol('BookSessionUseCase');
  static readonly GetSessionUseCase: unique symbol =
    Symbol('GetSessionUseCase');
  static readonly HandleExpiredPendingPaymentsUseCase: unique symbol = Symbol(
    'HandleExpiredPendingPaymentsUseCase',
  );

  //Repostitory
  static readonly SessionRepository: unique symbol =
    Symbol('SessionRepository');

  //Controller
  static readonly ScheduleController: unique symbol =
    Symbol('ScheduleController');
}

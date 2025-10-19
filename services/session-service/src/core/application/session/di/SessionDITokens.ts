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
  static readonly JoinSessionUseCase: unique symbol =
    Symbol('JoinSessionUseCase');
  static readonly StartSessionOnJoinUseCase: unique symbol = Symbol(
    'StartSessionOnJoinUseCase',
  );
  static readonly CompleteSessionOnFinishUseCase: unique symbol = Symbol(
    'CompleteSessionOnFinishUseCase',
  );
  static readonly AutoCompleteSessionsUseCase: unique symbol = Symbol(
    'AutoCompleteSessionsUseCase',
  );

  //Handler
  static readonly SessionPaymentSuccessfullEventHandler: unique symbol = Symbol(
    'SessionPaymentSuccessfullEventHandler',
  );

  //External Service
  static readonly MeetingService: unique symbol = Symbol('MeetingService');

  //Repostitory
  static readonly SessionRepository: unique symbol =
    Symbol('SessionRepository');

  //Controller
  static readonly SessionController: unique symbol =
    Symbol('SessionController');
}

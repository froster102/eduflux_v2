export class SlotDITokens {
  //Use-cases
  static readonly GetInstructorAvailableSlotsUseCase: unique symbol = Symbol(
    'GetInstructorAvailableSlotsUseCase',
  );

  //Repository
  static readonly SlotRepository: unique symbol = Symbol('SlotRepository');
}

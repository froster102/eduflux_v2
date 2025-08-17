import type { IUseCase } from './use-case.interface';

export interface ConfirmSessionBookingInput {
  sessionId: string;
  paymentId: string;
}

export interface IConfirmSessionBookingUseCase
  extends IUseCase<ConfirmSessionBookingInput, void> {}

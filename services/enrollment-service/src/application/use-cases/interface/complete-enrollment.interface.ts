import { IUseCase } from './use-case.interface';

export interface CompleteEnrollmentInput {
  enrollmentId: string;
  paymentId: string;
}

export interface ICompleteEnrollmentUseCase
  extends IUseCase<CompleteEnrollmentInput, void> {}

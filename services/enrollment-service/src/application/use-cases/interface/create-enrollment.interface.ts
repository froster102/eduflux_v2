import { IUseCase } from './use-case.interface';

export interface CreateEnrollmentInput {
  userId: string;
  courseId: string;
}

export interface CreateEnrollmentOutput {
  checkoutUrl: string;
}

export interface ICreateEnrollmentUseCase
  extends IUseCase<CreateEnrollmentInput, CreateEnrollmentOutput> {}

import { IUseCase } from './use-case.interface';

export interface CheckUserEnrollmentInput {
  userId: string;
  courseId: string;
}

export interface CheckEnrollmentOutput {
  isEnrolled: boolean;
}
export interface ICheckUserEnrollmentUseCase
  extends IUseCase<CheckUserEnrollmentInput, CheckEnrollmentOutput> {}

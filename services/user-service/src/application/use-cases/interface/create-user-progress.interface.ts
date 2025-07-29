import { IUseCase } from './use-case.interface';

export interface CreateUserProgressInput {
  userId: string;
  courseId: string;
}

export interface ICreateUserProgressUseCase
  extends IUseCase<CreateUserProgressInput, void> {}

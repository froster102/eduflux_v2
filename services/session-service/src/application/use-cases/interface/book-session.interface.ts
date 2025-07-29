import { IUseCase } from './use-case.interface';

export interface BookSessionInput {
  slotId: string;
  userId: string;
}

export interface BookSessionOutput {
  id: string;
  checkoutUrl: string;
}

export interface IBookSessionUseCase
  extends IUseCase<BookSessionInput, BookSessionOutput> {}

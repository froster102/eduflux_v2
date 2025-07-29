import { IUseCase } from './use-case.interface';

export interface GetUserSessionPriceInput {
  userId: string;
}

export interface GetUserSessionPriceOutput {
  id: string;
  price: number;
  currency: string;
  duration: number;
}

export interface IGetUserSessionPriceUseCase
  extends IUseCase<
    GetUserSessionPriceInput,
    GetUserSessionPriceOutput | null
  > {}

import type { IUseCase } from './use-case.interface';

export interface IHandleExpiredPendingPaymentsUseCase
  extends IUseCase<void, void> {}

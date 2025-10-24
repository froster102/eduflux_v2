import type { UseCase } from '@core/common/usecase/UseCase';

export interface HandleExpiredPendingPaymentsUseCase
  extends UseCase<void, void> {}

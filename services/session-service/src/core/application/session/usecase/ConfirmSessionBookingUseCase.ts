import type { ConfirmSessionBookingPort } from '@core/application/session/port/usecase/ConfirmBookingPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface ConfirmSessionBookingUseCase
  extends UseCase<ConfirmSessionBookingPort, void> {}

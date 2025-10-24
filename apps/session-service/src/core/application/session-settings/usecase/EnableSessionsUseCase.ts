import type { EnableSessionPort } from '@core/application/session-settings/port/usecase/EnableSessionPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface EnableSessionsUseCase
  extends UseCase<EnableSessionPort, void> {}

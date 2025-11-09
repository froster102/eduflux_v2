import type { EnableSessionPort } from '@core/application/session-settings/port/usecase/EnableSessionPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface EnableSessionsUseCase
  extends UseCase<EnableSessionPort, void> {}

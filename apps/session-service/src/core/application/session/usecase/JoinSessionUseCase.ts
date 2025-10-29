import type { JoinSessionPort } from '@core/application/session/port/usecase/JoinSessionPort';
import type { JoinSessionUseCaseResult } from '@core/application/session/usecase/types/JoinSessionUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface JoinSessionUseCase
  extends UseCase<JoinSessionPort, JoinSessionUseCaseResult> {}

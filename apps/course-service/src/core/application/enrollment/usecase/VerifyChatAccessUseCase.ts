import type { VerifyChatAccessUseCaseResult } from '@core/application/enrollment/port/usecase/type/VerifyChatAccessUseCaseResult';
import type { VerifyChatAccessPort } from '@core/application/enrollment/port/usecase/VerifyChatAccessPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface VerifyChatAccessUseCase
  extends UseCase<VerifyChatAccessPort, VerifyChatAccessUseCaseResult> {}

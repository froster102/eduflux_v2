import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { RemoveFromProgressPort } from '@application/progress/port/usecase/RemoveFromProgressPort';

export interface RemoveFromProgressUseCase
  extends UseCase<RemoveFromProgressPort, void> {}

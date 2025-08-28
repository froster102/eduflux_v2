import type { UseCase } from '@core/common/usecase/UseCase';
import type { RemoveFromProgressPort } from '@core/domain/progress/port/usecase/RemoveFromProgressPort';

export interface RemoveFromProgressUseCase
  extends UseCase<RemoveFromProgressPort, void> {}

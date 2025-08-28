import type { UseCase } from '@core/common/usecase/UseCase';
import type { AddToProgressPort } from '@core/domain/progress/port/usecase/AddToProgressPort';

export interface AddToProgressUseCase
  extends UseCase<AddToProgressPort, void> {}

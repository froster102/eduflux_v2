import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { AddToProgressPort } from '@application/progress/port/usecase/AddToProgressPort';

export interface AddToProgressUseCase
  extends UseCase<AddToProgressPort, void> {}

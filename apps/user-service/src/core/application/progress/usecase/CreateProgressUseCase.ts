import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { CreateProgressPort } from '@application/progress/port/usecase/CreateProgressPort';

export interface CreateProgressUseCase
  extends UseCase<CreateProgressPort, void> {}

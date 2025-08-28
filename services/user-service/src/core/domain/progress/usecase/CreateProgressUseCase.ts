import type { UseCase } from '@core/common/usecase/UseCase';
import type { CreateProgressPort } from '@core/domain/progress/port/usecase/CreateProgressPort';

export interface CreateProgressUseCase
  extends UseCase<CreateProgressPort, void> {}

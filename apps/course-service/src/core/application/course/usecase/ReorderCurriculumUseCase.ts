import type { ReorderCurriculumPort } from '@core/application/course/port/usecase/ReorderCurriculumPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface ReorderCurriculumUseCase
  extends UseCase<ReorderCurriculumPort, void> {}

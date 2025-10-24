import type { ReorderCurriculumPort } from '@core/application/course/port/usecase/ReorderCurriculumPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface ReorderCurriculumUseCase
  extends UseCase<ReorderCurriculumPort, void> {}

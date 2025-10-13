import type { DeleteLecturePort } from '@core/application/lecture/port/usecase/DeleteLecturePort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface DeleteLectureUseCase
  extends UseCase<DeleteLecturePort, void> {}

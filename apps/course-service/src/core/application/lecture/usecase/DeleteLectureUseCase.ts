import type { DeleteLecturePort } from '@core/application/lecture/port/usecase/DeleteLecturePort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface DeleteLectureUseCase
  extends UseCase<DeleteLecturePort, void> {}

import type { UpdateLecturePort } from '@core/application/lecture/port/usecase/UpdateLecturePort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface UpdateLectureUseCase
  extends UseCase<UpdateLecturePort, void> {}

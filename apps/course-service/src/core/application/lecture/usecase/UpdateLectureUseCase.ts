import type { UpdateLecturePort } from '@core/application/lecture/port/usecase/UpdateLecturePort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface UpdateLectureUseCase
  extends UseCase<UpdateLecturePort, void> {}

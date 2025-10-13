import type { CreateLecturePort } from '@core/application/lecture/port/usecase/CreateLecturePort';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CreateLectureUseCase
  extends UseCase<CreateLecturePort, Lecture> {}

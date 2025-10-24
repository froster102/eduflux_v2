import type { InitiateCourseRevisionPort } from '@core/application/course/port/persistence/InitiateCourseRevisionPort';
import type { UseCase } from '@core/common/usecase/UseCase';
import type { Course } from '@core/domain/course/entity/Course';

export interface InitiateCourseRevisionUseCase
  extends UseCase<InitiateCourseRevisionPort, Course> {}

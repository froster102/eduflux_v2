import type { ApproveCoursePort } from '@core/application/course/port/usecase/ApproveCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface ApproveCourseUseCase
  extends UseCase<ApproveCoursePort, Course> {}

import type { PublishCoursePort } from '@core/application/course/port/usecase/PublishCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface PublishCourseUseCase
  extends UseCase<PublishCoursePort, Course> {}

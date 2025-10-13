import type { UpdateCoursePort } from '@core/application/course/port/usecase/UpdateCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface UpdateCourseUseCase
  extends UseCase<UpdateCoursePort, Course> {}

import type { CreateCoursePort } from '@core/application/course/port/usecase/CreateCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CreateCourseUseCase
  extends UseCase<CreateCoursePort, Course> {}

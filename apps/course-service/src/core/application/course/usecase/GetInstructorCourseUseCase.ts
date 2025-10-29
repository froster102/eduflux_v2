import type { GetInstructorCoursePort } from '@core/application/course/port/usecase/GetInstructorCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetInstructorCourseUseCase
  extends UseCase<GetInstructorCoursePort, Course> {}

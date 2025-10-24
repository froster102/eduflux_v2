import type { RejectCoursePort } from '@core/application/course/port/usecase/RejectCoursePort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface RejectCourseUseCase
  extends UseCase<RejectCoursePort, Course> {}

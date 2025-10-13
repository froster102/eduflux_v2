import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetCoursePort } from '@core/application/course/port/usecase/GetCoursePort';

export interface GetCourseUseCase extends UseCase<GetCoursePort, Course> {}

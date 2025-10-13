import type { SubmitCourseForReviewPort } from '@core/application/course/port/usecase/SubmitForReviewPort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface SubmitCourseForReviewUseCase
  extends UseCase<SubmitCourseForReviewPort, Course> {}

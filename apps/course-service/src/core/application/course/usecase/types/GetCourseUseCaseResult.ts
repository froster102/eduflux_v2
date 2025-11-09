import type { CourseUseCaseDto } from '@core/application/course/usecase/dto/CourseUseCaseDto';

export type GetCourseUseCaseResult = CourseUseCaseDto & {
  isEnrolled?: boolean;
};

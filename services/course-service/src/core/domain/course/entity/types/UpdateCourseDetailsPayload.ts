import { CourseLevel } from '@core/domain/course/enum/CourseLevel';

export interface UpdateCourseDetailsPayload {
  title?: string;
  description?: string;
  thumbnail?: string | null;
  level?: CourseLevel | null;
  categoryId?: string;
  price?: number | null;
  isFree?: boolean;
}

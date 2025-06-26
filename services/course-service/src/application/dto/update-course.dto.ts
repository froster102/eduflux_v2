import { CourseLevel } from '@/domain/entity/course.entity';

export type UpdateCourseDto = {
  courseId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  level?: CourseLevel;
  price?: number;
  isFree?: boolean;
  categoryId?: string;
};

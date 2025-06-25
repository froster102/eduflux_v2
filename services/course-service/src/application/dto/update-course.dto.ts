import { CourseLevel } from '@/domain/entity/course.entity';
import { CreateCourseDto } from './create-course.dto';

export type UpdateCourseDto = Partial<CreateCourseDto> & {
  courseId: string;
  thumbnail: string;
  description: string;
  level: CourseLevel;
  price: number;
  isFree: boolean;
};

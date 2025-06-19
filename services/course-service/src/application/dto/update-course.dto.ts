import { CreateCourseDto } from './create-course.dto';

export type UpdateCourseDto = Partial<CreateCourseDto> & {
  courseId: string;
  thumbnail: string;
  price: number;
};

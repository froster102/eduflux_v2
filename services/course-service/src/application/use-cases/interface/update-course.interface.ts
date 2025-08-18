import type { IUseCase } from './use-case.interface';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { Course, type CourseLevel } from '@/domain/entity/course.entity';

export interface UpdateCourseInput {
  courseId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  level?: CourseLevel;
  price?: number;
  isFree?: boolean;
  categoryId?: string;
  actor: AuthenticatedUserDto;
}

export interface IUpdateCourseUseCase
  extends IUseCase<UpdateCourseInput, Course> {}

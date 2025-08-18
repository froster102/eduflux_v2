import type { CourseStatus } from '@/domain/entity/course.entity';
import type { IUseCase } from './use-case.interface';

export interface PublishedCourseDto {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  categoryId: string;
  price: number;
  isFree: boolean;
  status: CourseStatus;
  instructor: { id: string; name: string };
  enrollmentCount: number;
  averageRating: number;
  ratingCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetPublishedCourseInfoUseCase
  extends IUseCase<string, PublishedCourseDto> {}

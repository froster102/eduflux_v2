import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { CourseStatus } from '@/domain/entity/course.entity';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

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

export class GetPublishedCourseInfoUseCase
  implements IUseCase<string, PublishedCourseDto>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(courseId: string): Promise<PublishedCourseDto> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.status !== 'published') {
      throw new ForbiddenException(
        `You are not authroized to access this course.`,
      );
    }

    const publishedCourse: PublishedCourseDto = {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail!,
      categoryId: course.categoryId,
      instructor: course.instructor,
      isFree: course.isFree,
      level: course.level!,
      price: course.price!,
      status: course.status,
      publishedAt: course.publishedAt!.toString(),
      ratingCount: course.ratingCount,
      enrollmentCount: course.enrollmentCount,
      updatedAt: course.updatedAt.toString(),
      averageRating: course.averageRating,
      createdAt: course.createdAt.toString(),
    };

    return publishedCourse;
  }
}

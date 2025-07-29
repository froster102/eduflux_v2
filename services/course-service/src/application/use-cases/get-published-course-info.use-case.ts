import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  IGetPublishedCourseInfoUseCase,
  PublishedCourseDto,
} from './interface/get-published-course-info.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export class GetPublishedCourseInfoUseCase
  implements IGetPublishedCourseInfoUseCase
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

import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Course } from '@/domain/entity/course.entity';
import { PaginationQueryParams } from '../dto/pagination.dto';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';

export interface GetPublishedCoursesInput {
  paginationQueryParams: PaginationQueryParams;
}

export class GetPublishedCoursesUseCase
  implements
    IUseCase<GetPublishedCoursesInput, { courses: Course[]; total: number }>
{
  constructor(
    @inject(TYPES.CourseRepository) private courseRepository: ICourseRepository,
  ) {}

  async execute(
    getPublishedCoursesInput: GetPublishedCoursesInput,
  ): Promise<{ courses: Course[]; total: number }> {
    const { paginationQueryParams } = getPublishedCoursesInput;
    const result = await this.courseRepository.findAllPublishedCourses(
      paginationQueryParams,
    );
    return result;
  }
}

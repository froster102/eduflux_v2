import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { PaginationQueryParams } from '../dto/pagination.dto';
import { IUseCase } from './interface/use-case.interface';

export interface GetAllInstructorCoursesInput {
  actorId: string;
  paginationQueryParams: PaginationQueryParams;
}

export class GetAllInstructorCoursesUseCase
  implements
    IUseCase<GetAllInstructorCoursesInput, { courses: Course[]; total: number }>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    getAllInstructorCoursesInput: GetAllInstructorCoursesInput,
  ): Promise<{ courses: Course[]; total: number }> {
    const { actorId, paginationQueryParams } = getAllInstructorCoursesInput;
    const { courses, total } =
      await this.courseRepository.findAllInstructorCourses(
        actorId,
        paginationQueryParams,
      );

    return { courses, total };
  }
}

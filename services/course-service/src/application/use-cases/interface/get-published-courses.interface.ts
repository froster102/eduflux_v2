import type { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Course } from '@/domain/entity/course.entity';
import type { IUseCase } from './use-case.interface';

export interface GetPublishedCoursesInput {
  paginationQueryParams: PaginationQueryParams;
}

export interface GetPublishedCoursesOutput {
  courses: Course[];
  total: number;
}

export interface IGetPublishedCoursesUseCase
  extends IUseCase<GetPublishedCoursesInput, GetPublishedCoursesOutput> {}

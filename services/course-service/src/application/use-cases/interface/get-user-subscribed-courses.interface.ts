import type { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Course } from '@/domain/entity/course.entity';
import type { IUseCase } from './use-case.interface';

export interface GetUserSubscribedCoursesInput {
  userId: string;
  paginationQueryParams: PaginationQueryParams;
}

export interface GetUserSubscribedCoursesOutput {
  total: number;
  courses: Course[];
}

export interface IGetUserSubscribedCoursesUseCase
  extends IUseCase<
    GetUserSubscribedCoursesInput,
    GetUserSubscribedCoursesOutput
  > {}

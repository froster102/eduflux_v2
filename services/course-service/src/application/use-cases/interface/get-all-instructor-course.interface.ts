import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Course } from '@/domain/entity/course.entity';
import { IUseCase } from './use-case.interface';

export interface GetAllInstructorCoursesInput {
  actorId: string;
  paginationQueryParams: PaginationQueryParams;
}

export interface GetAllInstructorCoursesOutput {
  courses: Course[];
  total: number;
}

export interface IGetAllInstructorCoursesUseCase
  extends IUseCase<
    GetAllInstructorCoursesInput,
    GetAllInstructorCoursesOutput
  > {}

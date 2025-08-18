import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { IUseCase } from './use-case.interface';
import { Course } from '@/domain/entity/course.entity';

export interface GetInstructorCourseInput {
  id: string;
  actor: AuthenticatedUserDto;
}

export interface IGetInstructorCourseUseCase
  extends IUseCase<GetInstructorCourseInput, Course> {}

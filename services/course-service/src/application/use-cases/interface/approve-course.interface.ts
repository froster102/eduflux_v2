import { Course } from '@/domain/entity/course.entity';
import { IUseCase } from './use-case.interface';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';

export interface ApproveCourseInput {
  courseId: string;
  actor: AuthenticatedUserDto;
}

export interface IApproveCourseUseCase
  extends IUseCase<ApproveCourseInput, Course> {}

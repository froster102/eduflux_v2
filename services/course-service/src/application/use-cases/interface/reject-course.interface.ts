import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { Course } from '@/domain/entity/course.entity';

export interface RejectCourseInput {
  courseId: string;
  feedback: string;
  actor: AuthenticatedUserDto;
}

export interface IRejectCourseUseCase
  extends IUseCase<RejectCourseInput, Course> {}

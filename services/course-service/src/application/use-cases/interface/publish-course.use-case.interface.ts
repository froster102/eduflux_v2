import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { Course } from '@/domain/entity/course.entity';
import type { IUseCase } from './use-case.interface';

export interface PublishCourseInput {
  courseId: string;
  actor: AuthenticatedUserDto;
}

export interface IPublishCourseUseCase
  extends IUseCase<PublishCourseInput, Course> {}

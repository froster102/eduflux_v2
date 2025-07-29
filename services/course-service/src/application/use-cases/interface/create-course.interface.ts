import { Course } from '@/domain/entity/course.entity';
import { IUseCase } from './use-case.interface';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';

export interface CreateCourseInput {
  title: string;
  categoryId: string;
  actor: AuthenticatedUserDto;
}

export interface ICreateCourseUseCase
  extends IUseCase<CreateCourseInput, Course> {}

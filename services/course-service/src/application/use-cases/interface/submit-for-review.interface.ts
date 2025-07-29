import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { Course } from '@/domain/entity/course.entity';

export interface SubmitForReviewInput {
  courseId: string;
  actor: AuthenticatedUserDto;
}

export interface ISubmitForReviewUseCase
  extends IUseCase<SubmitForReviewInput, Course> {}

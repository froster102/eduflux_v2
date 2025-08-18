import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { IUseCase } from './use-case.interface';
import { Lecture } from '@/domain/entity/lecture.entity';

export interface CreateLectureInput {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
  actor: AuthenticatedUserDto;
}

export interface ICreateLectureUseCase
  extends IUseCase<CreateLectureInput, Lecture> {}

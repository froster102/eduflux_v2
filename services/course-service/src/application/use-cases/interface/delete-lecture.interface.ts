import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';

export interface DeleteLectureInput {
  courseId: string;
  lectureId: string;
  actor: AuthenticatedUserDto;
}

export interface IDeleteLectureUseCase
  extends IUseCase<DeleteLectureInput, void> {}

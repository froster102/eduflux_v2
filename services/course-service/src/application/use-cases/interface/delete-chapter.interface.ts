import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';

export interface DeleteChapterInput {
  courseId: string;
  chapterId: string;
  actor: AuthenticatedUserDto;
}

export interface IDeleteChapterUseCase
  extends IUseCase<DeleteChapterInput, void> {}

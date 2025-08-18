import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { IUseCase } from './use-case.interface';

export interface DeleteChapterInput {
  courseId: string;
  chapterId: string;
  actor: AuthenticatedUserDto;
}

export interface IDeleteChapterUseCase
  extends IUseCase<DeleteChapterInput, void> {}

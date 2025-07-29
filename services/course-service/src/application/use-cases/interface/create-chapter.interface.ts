import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { Chapter } from '@/domain/entity/chapter.entity';

export interface CreateChapterInput {
  courseId: string;
  title: string;
  description: string;
  actor: AuthenticatedUserDto;
}

export interface ICreateChapterUseCase
  extends IUseCase<CreateChapterInput, Chapter> {}

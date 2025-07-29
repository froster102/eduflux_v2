import { Chapter } from '@/domain/entity/chapter.entity';
import { IUseCase } from './use-case.interface';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { CreateChapterInput } from './create-chapter.interface';

export interface UpdateChapterDto extends Partial<CreateChapterInput> {
  courseId: string;
  chapterId: string;
}

export interface UpdateChapterInput {
  updateChapterDto: UpdateChapterDto;
  actor: AuthenticatedUserDto;
}

export interface IUpdateChapterUseCase
  extends IUseCase<UpdateChapterInput, Chapter> {}

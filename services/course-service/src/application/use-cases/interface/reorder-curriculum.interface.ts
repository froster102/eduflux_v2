import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { IUseCase } from './use-case.interface';

export interface ReorderCurriculumInput {
  courseId: string;
  items: { class: ClassType; id: string }[];
  actor: AuthenticatedUserDto;
}

export interface IReorderCurriculumUseCase
  extends IUseCase<ReorderCurriculumInput, void> {}

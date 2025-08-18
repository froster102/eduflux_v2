import { Asset } from '@/domain/entity/asset.entity';
import { Chapter } from '@/domain/entity/chapter.entity';
import { Lecture } from '@/domain/entity/lecture.entity';
import type { IUseCase } from './use-case.interface';

export type CurriculumItemWithAsset =
  | Chapter
  | (Lecture & { asset?: Partial<Asset> });

export interface IGetPublishedCourseCurriculumUseCase
  extends IUseCase<string, CurriculumItemWithAsset[]> {}

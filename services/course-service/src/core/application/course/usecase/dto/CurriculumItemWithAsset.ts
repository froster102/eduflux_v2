import type { Asset } from '@core/domain/asset/entity/Asset';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';

export type CurriculumItemWithAsset =
  | Chapter
  | (Lecture & { asset?: Partial<Asset> });

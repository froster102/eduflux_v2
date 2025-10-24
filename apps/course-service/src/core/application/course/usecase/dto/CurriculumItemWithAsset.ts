import type { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';
import type { Asset } from '@core/domain/asset/entity/Asset';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';

export type CurriculumItemWithAsset =
  | ChapterUseCaseDto
  | (Lecture & { asset?: Partial<Asset> });

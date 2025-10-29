import type { GetCourseCurriculumPort } from '@core/application/course/port/usecase/GetCourseCurriculumPort';
import type { CurriculumItemWithAsset } from '@core/application/course/usecase/dto/CurriculumItemWithAsset';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetCourseCurriculumUseCase
  extends UseCase<GetCourseCurriculumPort, CurriculumItemWithAsset[]> {}

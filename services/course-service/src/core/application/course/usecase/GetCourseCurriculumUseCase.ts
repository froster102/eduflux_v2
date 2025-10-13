import type { GetCourseCurriculumPort } from '@core/application/course/port/usecase/GetCourseCurriculumPort';
import type { CurriculumItemWithAsset } from '@core/application/course/usecase/dto/CurriculumItemWithAsset';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetCourseCurriculumUseCase
  extends UseCase<GetCourseCurriculumPort, CurriculumItemWithAsset[]> {}

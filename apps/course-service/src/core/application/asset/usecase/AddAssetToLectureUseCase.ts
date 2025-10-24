import type { AddAssetToLecturePort } from '@core/application/asset/port/usecase/AddAssetToLecturePort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface AddAssetToLectureUseCase
  extends UseCase<AddAssetToLecturePort, void> {}

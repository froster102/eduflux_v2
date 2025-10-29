import type { AddAssetToLecturePort } from '@core/application/asset/port/usecase/AddAssetToLecturePort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface AddAssetToLectureUseCase
  extends UseCase<AddAssetToLecturePort, void> {}

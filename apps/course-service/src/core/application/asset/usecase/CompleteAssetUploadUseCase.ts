import type { CompleteAssetUploadPort } from '@core/application/asset/port/usecase/CompleteAssetUploadPort';
import type { AssetUseCaseDto } from '@core/application/asset/usecase/dto/AssetUseCaseDto';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CompleteAssetUploadUseCase
  extends UseCase<CompleteAssetUploadPort, AssetUseCaseDto> {}

import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import { AddAssetToLectureService } from '@core/application/asset/service/AddAssetToLectureService';
import { CompleteAssetUploadService } from '@core/application/asset/service/CompleteAssetUploadService';
import type { AddAssetToLectureUseCase } from '@core/application/asset/usecase/AddAssetToLectureUseCase';
import type { CompleteAssetUploadUseCase } from '@core/application/asset/usecase/CompleteAssetUploadUseCase';
import { MongooseAssetRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/asset/MongooseAssetRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const AssetModule: ContainerModule = new ContainerModule((options) => {
  //Use-cases
  options
    .bind<AddAssetToLectureUseCase>(AssetDITokens.AddAssetToLectureUseCase)
    .to(AddAssetToLectureService);
  options
    .bind<CompleteAssetUploadUseCase>(AssetDITokens.CompleteAssetUploadUseCase)
    .to(CompleteAssetUploadService);

  //Repository
  options
    .bind<AssetRepositoryPort>(AssetDITokens.AssetRepository)
    .to(MongooseAssetRepositoryAdapter);
});

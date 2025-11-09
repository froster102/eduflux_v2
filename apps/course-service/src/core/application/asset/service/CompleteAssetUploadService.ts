import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { CompleteAssetUploadPort } from '@core/application/asset/port/usecase/CompleteAssetUploadPort';
import type { CompleteAssetUploadUseCase } from '@core/application/asset/usecase/CompleteAssetUploadUseCase';
import type { AssetUseCaseDto } from '@core/application/asset/usecase/dto/AssetUseCaseDto';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { inject } from 'inversify';

export class CompleteAssetUploadService implements CompleteAssetUploadUseCase {
  constructor(
    @inject(AssetDITokens.AssetRepository)
    private readonly assetRepository: AssetRepositoryPort,
  ) {}

  async execute(payload: CompleteAssetUploadPort): Promise<AssetUseCaseDto> {
    const { additionalMetadata, duration, mediaSource, providerSpecificId } =
      payload;

    const asset =
      await this.assetRepository.findByProviderSpecificId(providerSpecificId);

    if (!asset) {
      throw new NotFoundException(
        `Asset with ID:${providerSpecificId} not found`,
      );
    }

    if (mediaSource) {
      asset.addMediaSource(mediaSource);
    }

    asset.confirmUpload(providerSpecificId, duration, additionalMetadata);

    await this.assetRepository.update(asset.id, asset);

    return asset;
  }
}

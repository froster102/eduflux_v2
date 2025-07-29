import { Asset } from '@/domain/entity/asset.entity';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import type {
  CompleteAssetUploadDto,
  ICompleteAssetUploadUseCase,
} from './interface/complete-asset-upload.interface';

@injectable()
export class CompleteAssetUploadUseCase implements ICompleteAssetUploadUseCase {
  constructor(
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(
    completeAssetUploadDto: CompleteAssetUploadDto,
  ): Promise<Asset> {
    const { additionalMetadata, duration, mediaSource, providerSpecificId } =
      completeAssetUploadDto;

    const asset =
      await this.assetRepository.findByProvideSpecificId(providerSpecificId);

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

import { Asset, MediaSource, ResourceType } from '@/domain/entity/asset.entity';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface CompleteAssetUploadDto {
  providerSpecificId: string;
  originalFileName: string;
  duration: number | null;
  additionalMetadata: Record<string, any>;
  mediaSource: MediaSource;
  resourseType: ResourceType;
}

@injectable()
export class CompleteAssetUploadUseCase {
  constructor(
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(dto: CompleteAssetUploadDto): Promise<Asset> {
    const asset = await this.assetRepository.findByProvideSpecificId(
      dto.providerSpecificId,
    );

    if (!asset) {
      throw new NotFoundException(
        `Asset with ID:${dto.providerSpecificId} not found`,
      );
    }

    if (dto.mediaSource) {
      asset.addMediaSource(dto.mediaSource);
    }

    asset.confirmUpload(
      dto.providerSpecificId,
      dto.duration,
      dto.additionalMetadata,
    );

    await this.assetRepository.update(asset.id, asset);

    return asset;
  }
}

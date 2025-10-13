import type { Asset } from '@core/domain/asset/entity/Asset';
import type { MediaSource } from '@core/domain/asset/entity/types/CreateAssetPayload';
import type { AccessType } from '@core/domain/asset/enum/AccessType';
import type { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { ResourceType } from '@core/domain/asset/enum/ResourceType';

export class AssetUseCaseDto {
  readonly id: string;
  readonly providerSpecificId: string | null;
  readonly resourceType: ResourceType | null;
  readonly accessType: AccessType;
  readonly originalFileName: string | null;
  readonly duration: number | null;
  readonly status: MediaStatus;
  readonly mediaSources: MediaSource[];
  readonly additionalMetadata: Record<string, any> | null;

  private constructor(asset: Asset) {
    this.id = asset.id;
    this.providerSpecificId = asset.providerSpecificId;
    this.resourceType = asset.resourceType;
    this.accessType = asset.accessType;
    this.originalFileName = asset.originalFileName;
    this.duration = asset.duration;
    this.status = asset.status;
    this.mediaSources = asset.mediaSources;
    this.additionalMetadata = asset.additionalMetadata;
  }
  static fromEntity(asset: Asset) {
    return new AssetUseCaseDto(asset);
  }

  static fromEntities(assets: Asset[]) {
    return assets.map((asset) => this.fromEntity(asset));
  }
}

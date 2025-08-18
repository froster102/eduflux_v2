import { Asset } from '@/domain/entity/asset.entity';
import type { IAsset } from '../database/schema/asset.schema';
import type { IMapper } from './mapper.interface';
import { injectable } from 'inversify';

@injectable()
export class AssetMapper implements IMapper<Asset, IAsset> {
  toDomain(raw: IAsset): Asset {
    return Asset.fromPersistence(
      (raw._id as string).toString(),
      raw.provider,
      raw.providerSpecificId,
      raw.resourceType,
      raw.accessType,
      raw.originalFileName,
      raw.duration,
      raw.status,
      raw.mediaSources,
      raw.additionalMetadata,
    );
  }

  toPersistence(raw: Asset): Partial<IAsset> {
    return {
      _id: raw.id,
      provider: raw.provider,
      providerSpecificId: raw.providerSpecificId,
      resourceType: raw.resourceType,
      accessType: raw.accessType,
      originalFileName: raw.originalFileName,
      duration: raw.duration,
      status: raw.status,
      mediaSources: raw.mediaSources,
      additionalMetadata: raw.additionalMetadata,
    };
  }

  toDomainArray(raw: IAsset[]): Asset[] {
    return raw.map((r) => this.toDomain(r));
  }
}

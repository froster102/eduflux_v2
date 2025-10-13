import { Asset } from '@core/domain/asset/entity/Asset';
import { StorageProvider } from '@core/domain/asset/enum/StorageProvider';
import { AccessType } from '@core/domain/asset/enum/AccessType';
import { ResourceType } from '@core/domain/asset/enum/ResourceType';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { MongooseAsset } from '@infrastructure/adapter/persistence/mongoose/model/asset/MongooseAsset';

export class MongooseAssetMapper {
  static toDomainEntity(doc: MongooseAsset): Asset {
    return Asset.new({
      id: doc._id,
      provider: doc.provider as StorageProvider,
      providerSpecificId: doc.providerSpecificId,
      resourceType: doc.resourceType as ResourceType | null,
      accessType: doc.accessType as AccessType,
      originalFileName: doc.originalFileName,
      duration: doc.duration,
      status: doc.status as MediaStatus,
      mediaSources: doc.mediaSources,
      additionalMetadata: doc.additionalMetadata,
    });
  }

  static toDomainEntities(docs: MongooseAsset[]): Asset[] {
    return docs.map((doc) => this.toDomainEntity(doc));
  }

  static toMongooseEntity(domain: Asset): Partial<MongooseAsset> {
    return {
      _id: domain.id,
      provider: domain.provider,
      providerSpecificId: domain.providerSpecificId,
      resourceType: domain.resourceType,
      accessType: domain.accessType,
      originalFileName: domain.originalFileName,
      duration: domain.duration,
      status: domain.status,
      mediaSources: domain.mediaSources,
      additionalMetadata: domain.additionalMetadata,
    };
  }
}

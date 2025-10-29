import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { Asset } from '@core/domain/asset/entity/Asset';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { MongooseAssetMapper } from '@infrastructure/adapter/persistence/mongoose/model/asset/mapper/MongooseAssetMapper';
import {
  AssetModel,
  type MongooseAsset,
} from '@infrastructure/adapter/persistence/mongoose/model/asset/MongooseAsset';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseAssetRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Asset, MongooseAsset>
  implements AssetRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(AssetModel, new MongooseAssetMapper(), session);
  }

  async findByProviderSpecificId(id: string): Promise<Asset | null> {
    const doc = await AssetModel.findOne({ providerSpecificId: id }, null, {
      session: this.session,
    });
    return doc ? this.mapper.toDomain(doc) : null;
  }
}

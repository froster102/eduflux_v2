import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { Asset } from '@core/domain/asset/entity/Asset';
import { MongooseAssetMapper } from '@infrastructure/adapter/persistence/mongoose/model/asset/mapper/MongooseAssetMapper';
import {
  AssetModel,
  type MongooseAsset,
} from '@infrastructure/adapter/persistence/mongoose/model/asset/MongooseAsset';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
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
    super(AssetModel, MongooseAssetMapper, session);
  }

  async findByProviderSpecificId(id: string): Promise<Asset | null> {
    const doc = await AssetModel.findOne({ providerSpecificId: id }, null, {
      session: this.session,
    });
    return doc ? MongooseAssetMapper.toDomainEntity(doc) : null;
  }
}

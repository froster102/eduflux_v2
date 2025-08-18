import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import type { IAsset } from '../schema/asset.schema';
import { inject, injectable } from 'inversify';
import { MongoBaseRepository } from './base.repository';
import { Asset } from '@/domain/entity/asset.entity';
import AssetModel from '../models/asset.model';
import { TYPES } from '@/shared/di/types';

@injectable()
export class MongoAssetRepository
  extends MongoBaseRepository<Asset, IAsset>
  implements IAssetRepository
{
  constructor(
    @inject(TYPES.AssetMapper)
    private readonly assetMapper: IMapper<Asset, IAsset>,
  ) {
    super(AssetModel, assetMapper);
  }

  async findByProvideSpecificId(id: string): Promise<Asset | null> {
    const asset = await AssetModel.findOne({ providerSpecificId: id });
    return asset ? this.assetMapper.toDomain(asset) : null;
  }
}

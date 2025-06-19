import { Asset } from '../entity/asset.entity';
import { IBaseRepository } from './base.repository';

export interface IAssetRepository extends IBaseRepository<Asset> {
  findByProvideSpecificId(id: string): Promise<Asset | null>;
}

import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Asset } from '@core/domain/asset/entity/Asset';

export interface AssetRepositoryPort extends BaseRepositoryPort<Asset> {
  findByProviderSpecificId(id: string): Promise<Asset | null>;
}

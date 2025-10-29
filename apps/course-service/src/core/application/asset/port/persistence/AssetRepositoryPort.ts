import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Asset } from '@core/domain/asset/entity/Asset';

export interface AssetRepositoryPort extends BaseRepositoryPort<Asset> {
  findByProviderSpecificId(id: string): Promise<Asset | null>;
}

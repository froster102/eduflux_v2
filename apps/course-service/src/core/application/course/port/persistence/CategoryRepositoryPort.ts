import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Category } from '@core/domain/category/entity/Category';

export interface CategoryRepositoryPort extends BaseRepositoryPort<Category> {
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
}

import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Category } from '@core/domain/category/entity/Category';

export interface CategoryRepositoryPort extends BaseRepositoryPort<Category> {
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
}

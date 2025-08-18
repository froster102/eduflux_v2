import { Category } from '../entity/category.entity';
import type { IBaseRepository } from './base.repository';

export interface ICategoryRepository extends IBaseRepository<Category> {
  findBySlug(slug: string): Promise<Category | null>;
}

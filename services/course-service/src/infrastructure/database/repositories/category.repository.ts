import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import { inject, injectable } from 'inversify';
import { MongoBaseRepository } from './base.repository';
import type { ICategory } from '../schema/category.schema';
import type { ICategoryRepository } from '@/domain/repositories/category.repository';
import { TYPES } from '@/shared/di/types';
import CategoryModel from '../models/category.model';
import { Category } from '@/domain/entity/category.entity';

@injectable()
export class MongoCategoryRepository
  extends MongoBaseRepository<Category, ICategory>
  implements ICategoryRepository
{
  constructor(
    @inject(TYPES.CategoryMapper)
    private categoryMapper: IMapper<Category, ICategory>,
  ) {
    super(CategoryModel, categoryMapper);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await CategoryModel.findOne({ titleCleaned: slug });

    return category ? this.categoryMapper.toDomain(category) : null;
  }
}

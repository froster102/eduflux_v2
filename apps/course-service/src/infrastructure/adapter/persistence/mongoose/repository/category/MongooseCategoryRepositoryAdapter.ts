import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import { Category } from '@core/domain/category/entity/Category';
import { MongooseCategoryMapper } from '@infrastructure/adapter/persistence/mongoose/model/category/mapper/MongooseCategoryMapper';
import {
  CategoryModel,
  type MongooseCategory,
} from '@infrastructure/adapter/persistence/mongoose/model/category/MongooseCategory';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseCategoryRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Category, MongooseCategory>
  implements CategoryRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(CategoryModel, new MongooseCategoryMapper(), session);
  }

  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find({});
    return docs ? this.mapper.toDomainEntities(docs) : [];
  }

  async findByName(name: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ name }, null, {
      session: this.session,
    });
    return doc ? this.mapper.toDomain(doc) : null;
  }
}

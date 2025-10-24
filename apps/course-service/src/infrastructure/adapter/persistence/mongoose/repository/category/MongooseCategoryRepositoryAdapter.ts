import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import { Category } from '@core/domain/category/entity/Category';
import { MongooseCategoryMapper } from '@infrastructure/adapter/persistence/mongoose/model/category/mapper/MongooseCategoryMapper';
import {
  CategoryModel,
  type MongooseCategory,
} from '@infrastructure/adapter/persistence/mongoose/model/category/MongooseCategory';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
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
    super(CategoryModel, MongooseCategoryMapper, session);
  }

  async findAll(): Promise<Category[]> {
    const docs = await CategoryModel.find({});
    return docs ? MongooseCategoryMapper.toDomainEntities(docs) : [];
  }

  async findByName(name: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ name }, null, {
      session: this.session,
    });
    return doc ? MongooseCategoryMapper.toDomainEntity(doc) : null;
  }
}

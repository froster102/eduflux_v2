import { Category } from '@core/domain/category/entity/Category';
import type { Mapper } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/mapper/MongooseBaseMapper';
import type { MongooseCategory } from '@infrastructure/adapter/persistence/mongoose/model/category/MongooseCategory';

export class MongooseCategoryMapper
  implements Mapper<Category, MongooseCategory>
{
  toDomain(doc: MongooseCategory): Category {
    return Category.new({
      id: doc._id,
      title: doc.title,
      titleCleaned: doc.titleCleaned,
    });
  }

  toDomainEntities(docs: MongooseCategory[]): Category[] {
    return docs.map((doc) => this.toDomain(doc));
  }

  toPersistence(domain: Category): MongooseCategory {
    return {
      _id: domain.id,
      title: domain.title,
      titleCleaned: domain.titleCleaned,
    };
  }
}

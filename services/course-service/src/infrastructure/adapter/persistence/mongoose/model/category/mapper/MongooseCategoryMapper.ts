import { Category } from '@core/domain/category/entity/Category';
import type { MongooseCategory } from '@infrastructure/adapter/persistence/mongoose/model/category/MongooseCategory';

export class MongooseCategoryMapper {
  static toDomainEntity(doc: MongooseCategory): Category {
    return Category.new({
      id: doc._id,
      title: doc.title,
      titleCleaned: doc.titleCleaned,
    });
  }

  static toDomainEntities(docs: MongooseCategory[]): Category[] {
    return docs.map((doc) => this.toDomainEntity(doc));
  }

  static toMongooseEntity(domain: Category): MongooseCategory {
    return {
      _id: domain.id,
      title: domain.title,
      titleCleaned: domain.titleCleaned,
    };
  }
}

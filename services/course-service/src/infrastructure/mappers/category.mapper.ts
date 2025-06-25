import { injectable } from 'inversify';
import { IMapper } from './mapper.interface';
import { Category } from '@/domain/entity/category.entity';
import { ICategory } from '../database/schema/category.schema';

@injectable()
export class CategoryMapper implements IMapper<Category, ICategory> {
  toDomain(raw: ICategory): Category {
    return Category.fromPersistence(
      (raw._id as string).toString(),
      raw.title,
      raw.titleCleaned,
    );
  }

  toPersistence(raw: Category): Partial<ICategory> {
    return {
      _id: raw.id,
      title: raw.title,
      titleCleaned: raw.titleCleaned,
    };
  }

  toDomainArray(raw: ICategory[]): Category[] {
    return raw.map((r) => this.toDomain(r));
  }
}

import type { IMapper } from '@/infrastructure/mapper/interface/mapper.interface';
import type { IBaseRepository } from '@/domain/repositories/base.repository';
import { DatabaseException } from '@/infrastructure/exceptions/database.exception';
import { Model } from 'mongoose';

export abstract class MongoBaseRepository<TDomain, TPersistence>
  implements IBaseRepository<TDomain>
{
  constructor(
    private readonly model: Model<TPersistence>,
    private readonly mapper: IMapper<TDomain, TPersistence>,
  ) {}

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.model
      .create(persistence)
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
    const persistence = this.mapper.toPersistence(data as TDomain);

    const updated = await this.model
      .findOneAndUpdate({ _id: id }, persistence)
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });

    return updated ? this.mapper.toDomain(updated.toObject()) : null;
  }

  async findById(id: string): Promise<TDomain | null> {
    const found = await this.model
      .findOne({ _id: id })
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });
    return found ? this.mapper.toDomain(found.toObject()) : null;
  }

  async findByIds(ids: string[]): Promise<TDomain[]> {
    const enities = await this.model.find({ _id: { $in: ids } });
    return enities ? this.mapper.toDomainArray(enities) : [];
  }

  async getTotalItems(): Promise<number> {
    const total = await this.model.countDocuments();
    return total;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0 ? true : false;
  }
}

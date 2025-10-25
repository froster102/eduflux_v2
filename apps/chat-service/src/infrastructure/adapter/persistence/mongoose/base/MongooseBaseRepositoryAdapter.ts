import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Mapper } from '@infrastructure/adapter/persistence/mongoose/base/mapper/MongooseBaseMapper';
import { Model } from 'mongoose';

export abstract class MongooseBaseRepositoryAdpater<TPersistence, TDomain>
  implements BaseRepositoryPort<TDomain>
{
  protected defaultLimit = 10;
  protected defaultOffset = 0;
  constructor(
    protected readonly model: Model<TPersistence>,
    protected readonly mapper: Mapper<TDomain, TPersistence>,
  ) {}

  async save(domainEntity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(domainEntity);
    const saved = await this.model.create(persistence);
    return this.mapper.toDomain(saved.toObject());
  }

  async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
    const updated = await this.model.findOneAndUpdate(
      { _id: id },
      this.mapper.toPersistence(data as unknown as TDomain),
    );
    return updated ? this.mapper.toDomain(updated.toObject()) : null;
  }

  async findById(id: string): Promise<TDomain | null> {
    const found = await this.model.findOne({ _id: id });
    return found ? this.mapper.toDomain(found.toObject()) : null;
  }

  async findByIds(ids: string[]): Promise<TDomain[]> {
    const docs = await this.model.find({ _id: { $in: ids } });

    return docs ? this.mapper.toDomainEntities(docs) : [];
  }
}

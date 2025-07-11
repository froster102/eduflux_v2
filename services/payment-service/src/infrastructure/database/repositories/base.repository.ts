import type { IMapper } from '@/infrastructure/mappers/interface/mapper.interface';
import { IBaseRepository } from '@/domain/repositories/base.respository';
import { DatabaseException } from '@/infrastructure/exception/database.exception';
import { Model } from 'mongoose';

export abstract class MongoBaseRepositoryImpl<TPersistence, TDomain>
  implements IBaseRepository<TDomain>
{
  constructor(
    protected readonly model: Model<TPersistence>,
    protected readonly mapper: IMapper<TDomain, TPersistence>,
  ) {}

  async save(domainEntity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(domainEntity);
    const saved = await this.model
      .create(persistence)
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });
    return this.mapper.toDomain(saved.toObject());
  }

  async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
    const updated = await this.model
      .findOneAndUpdate(
        { _id: id },
        this.mapper.toPersistence(data as unknown as TDomain),
      )
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
}

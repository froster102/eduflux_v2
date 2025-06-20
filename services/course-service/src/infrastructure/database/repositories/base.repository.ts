import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import { Model } from 'mongoose';
import { DatabaseException } from '@/infrastructure/exceptions/database.exception';
import type { IBaseRepository } from '@/domain/repositories/base.repository';

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

  async find(query?: {
    filter?: { [P in keyof TDomain]?: TDomain[P] };
    projection?: {
      [P in keyof TDomain]?: boolean | number;
    };
    sort?: {
      [P in keyof TDomain]?: 'asc' | 'desc' | 1 | -1;
    };
    skip?: number;
    limit?: number;
    populate?: string[] | { path: string; select?: string }[];
    include?: Array<any>;
  }): Promise<TDomain[]> {
    let filter = {};
    let projection = {};
    let skip: number = 0;
    let limit: number = 0;
    if (query) {
      if (query.filter) {
        filter = query?.filter;
      }
      if (query.projection) {
        projection = query.projection;
      }
      if (query.skip) {
        skip = query.skip ?? 0;
      }
      if (query.limit) {
        limit = query.limit ?? 0;
      }
    }
    const enities = await this.model
      .find(filter, projection)
      .skip(skip)
      .limit(limit);

    return enities ? this.mapper.toDomainArray(enities) : [];
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0 ? true : false;
  }
}

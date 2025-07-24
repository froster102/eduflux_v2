import type { ClientSession } from 'mongoose';
import type { IBaseRepository } from '@/domain/repositories/base.repository';
import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import { Model } from 'mongoose';
import { DatabaseException } from '@/infrastructure/exceptions/database.exception';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';

export abstract class MongoBaseRepository<TDomain, TPersistence>
  implements IBaseRepository<TDomain>
{
  protected session?: ClientSession;

  constructor(
    private readonly model: Model<TPersistence>,
    private readonly mapper: IMapper<TDomain, TPersistence>,
    session?: ClientSession,
  ) {
    this.session = session;
  }

  async saveMany(entities: TDomain[]): Promise<TDomain[]> {
    const persistenceEntities = entities.map((e) =>
      this.mapper.toPersistence(e),
    );

    const result = await this.model.insertMany(persistenceEntities, {
      session: this.session,
    });

    return this.mapper.toDomainArray(result as TPersistence[]);
  }

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const [saved] = await this.model
      .create([persistence], { session: this.session })
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
    const persistence = this.mapper.toPersistence(data as TDomain);

    const updated = await this.model
      .findOneAndUpdate({ _id: id }, persistence, { session: this.session })
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });

    return updated ? this.mapper.toDomain(updated.toObject()) : null;
  }

  async findById(id: string): Promise<TDomain | null> {
    const found = await this.model
      .findOne({ _id: id }, null, { session: this.session })
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error.message as string);
      });
    return found ? this.mapper.toDomain(found.toObject()) : null;
  }

  async findByIds(ids: string[]): Promise<TDomain[]> {
    const enities = await this.model.find({ _id: { $in: ids } }, null, {
      session: this.session,
    });
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

  async findWithPaginationAndFilter(
    paginationQueryParams: PaginationQueryParams,
  ): Promise<TDomain[]> {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'asc',
    } = paginationQueryParams;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = limit;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const result = await this.model.find(query, null, options);

    return result ? this.mapper.toDomainArray(result) : [];
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0 ? true : false;
  }

  updateMany(ids: string[], data: (TDomain | undefined)[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

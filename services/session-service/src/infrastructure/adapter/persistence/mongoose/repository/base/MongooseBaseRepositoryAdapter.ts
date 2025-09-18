import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Mapper } from '@infrastructure/adapter/persistence/mongoose/mapper/MongooseBaseMapper';
import { DatabaseException } from '@infrastructure/exceptions/database.exception';
import type { AnyBulkWriteOperation, ClientSession, Model } from 'mongoose';

export abstract class MongooseBaseRepositoryAdapter<TDomain, TPersistence>
  implements BaseRepositoryPort<TDomain>
{
  protected session?: ClientSession;
  protected defaultOffset = 0;
  protected defaultLimit = 10;

  constructor(
    private readonly model: Model<TPersistence>,
    private readonly mapper: Mapper<TDomain, TPersistence>,
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

    return this.mapper.toDomainEntities(result as TPersistence[]);
  }

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const [saved] = await this.model
      .create([persistence], { session: this.session })
      .catch((error: Record<string, any>) => {
        throw new DatabaseException(error?.message as string);
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
    return enities ? this.mapper.toDomainEntities(enities) : [];
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

    return enities ? this.mapper.toDomainEntities(enities) : [];
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount > 0 ? true : false;
  }

  async updateMany(
    updates: { id: string; data: Partial<TDomain> }[],
  ): Promise<void> {
    if (updates.length === 0) {
      return;
    }

    const operations: AnyBulkWriteOperation<any>[] = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data },
      },
    }));

    await this.model.bulkWrite(operations, { session: this.session });
  }
}

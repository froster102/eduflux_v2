import type { BaseRepositoryPort } from '@shared/common/port/persistence/BaseRepositoryPort';
import type { Model, ClientSession } from 'mongoose';

export abstract class MongooseBaseRepository<TDomain, TMongoose>
  implements BaseRepositoryPort<TDomain>
{
  protected readonly defaultLimit = 20;
  protected readonly defaultOffset = 0;

  constructor(
    protected readonly model: Model<TMongoose>,
    protected readonly mapper: {
      toDomainEntity(doc: TMongoose): TDomain;
      toMongooseEntity(domain: TDomain): Partial<TMongoose>;
      toDomainEntities(docs: TMongoose[]): TDomain[];
    },
    protected readonly session?: ClientSession,
  ) {}

  async save(entity: TDomain): Promise<TDomain> {
    const mongooseEntity = this.mapper.toMongooseEntity(entity);
    const doc = await this.model.create([mongooseEntity], {
      session: this.session,
    });
    return this.mapper.toDomainEntity(doc[0]);
  }

  async saveMany(entities: TDomain[]): Promise<TDomain[]> {
    const mongooseEntities = entities.map((entity) =>
      this.mapper.toMongooseEntity(entity),
    );
    const docs = await this.model.create(mongooseEntities, {
      session: this.session,
    });
    return this.mapper.toDomainEntities(docs);
  }

  async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, session: this.session },
    );
    return doc ? this.mapper.toDomainEntity(doc) : null;
  }

  async updateMany(
    updates: { id: string; data: Partial<TDomain> }[],
  ): Promise<void> {
    const bulkOps = updates.map(({ id, data }) => ({
      updateOne: {
        filter: { _id: id },
        update: { ...data, updatedAt: new Date() },
      },
    }));
    await this.model.bulkWrite(bulkOps, { session: this.session });
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.model.findOne({ _id: id });
    return doc ? this.mapper.toDomainEntity(doc) : null;
  }

  async findByIds(ids: string[]): Promise<TDomain[]> {
    const docs = await this.model.find({ _id: { $in: ids } }, null, {
      session: this.session,
    });
    return this.mapper.toDomainEntities(docs);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id, {
      session: this.session,
    });
    return !!result;
  }
}

import {
  UserGrowthSnapshotModel,
  type MongooseUserGrowthSnapshot,
} from '@infrastructure/database/mongoose/model/MongooseUserGrowthSnapshot';
import { MongooseUserGrowthSnapshotMapper } from '@infrastructure/database/mongoose/model/user-growth-snapshot/mapper/MongooseUserGrowthSnapshotMapper';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { UserGrowthSnapshot } from '@analytics/entities/UserGrowthSnapshot';
import type { IUserGrowthSnapshotRepository } from '@analytics/repository/UserGrowthSnapshotRepository';

export class MongooseUserGrowthSnapshotRepository
  extends MongooseBaseRepositoryAdapter<
    UserGrowthSnapshot,
    MongooseUserGrowthSnapshot
  >
  implements IUserGrowthSnapshotRepository
{
  constructor() {
    super(UserGrowthSnapshotModel, new MongooseUserGrowthSnapshotMapper());
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  async findByDate(date: Date): Promise<UserGrowthSnapshot | null> {
    const normalizedDate = this.normalizeDate(date);
    const document = await this.model.findOne({ date: normalizedDate }).exec();

    if (!document) {
      return null;
    }

    return this.mapper.toDomain(document);
  }

  async findOrCreateByDate(date: Date): Promise<UserGrowthSnapshot> {
    const normalizedDate = this.normalizeDate(date);
    let snapshot = await this.findByDate(normalizedDate);

    if (!snapshot) {
      snapshot = UserGrowthSnapshot.new({
        date: normalizedDate,
        userCount: 0,
      });
      await this.save(snapshot);
    }

    return snapshot;
  }

  async incrementUserCount(date: Date): Promise<UserGrowthSnapshot> {
    const normalizedDate = this.normalizeDate(date);

    const updated = await this.model
      .findOneAndUpdate(
        { date: normalizedDate },
        {
          $inc: { userCount: 1 },
          $setOnInsert: {
            date: normalizedDate,
            createdAt: new Date(),
          },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, new: true },
      )
      .exec();

    if (!updated) {
      throw new Error('Failed to update user growth snapshot');
    }

    return this.mapper.toDomain(updated);
  }

  async getLastNDays(days: number): Promise<UserGrowthSnapshot[]> {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return this.getByDateRange(startDate, endDate);
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<UserGrowthSnapshot[]> {
    const documents = await this.model
      .find({
        date: {
          $gte: this.normalizeDate(startDate),
          $lte: this.normalizeDate(endDate),
        },
      })
      .sort({ date: 1 })
      .exec();

    return this.mapper.toDomainEntities(documents);
  }

  async findById(id: string): Promise<UserGrowthSnapshot | null> {
    const date = new Date(id);
    return this.findByDate(date);
  }

  async save(entity: UserGrowthSnapshot): Promise<UserGrowthSnapshot> {
    const persistence = this.mapper.toPersistence(entity);

    const [saved] = await this.model.create([persistence]);
    return this.mapper.toDomain(saved);
  }
}

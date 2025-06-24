import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import type { IChapter } from '../schema/chapter.schema';
import { Chapter } from '@/domain/entity/chapter.entity';
import { MongoBaseRepository } from './base.repository';
import ChapterModel from '../models/chapter.model';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { AnyBulkWriteOperation } from 'mongoose';

export class MongoChapterRepository
  extends MongoBaseRepository<Chapter, IChapter>
  implements IChapterRepository
{
  constructor(
    @inject(TYPES.ChapterMapper)
    private readonly chapperMapper: IMapper<Chapter, IChapter>,
  ) {
    super(ChapterModel, chapperMapper);
  }

  async findByCourseId(courseId: string): Promise<Chapter[]> {
    const chapter = await ChapterModel.find({ courseId });
    return chapter.length > 0 ? this.chapperMapper.toDomainArray(chapter) : [];
  }

  async updateAll(chapters: Chapter[]): Promise<void> {
    const operations: AnyBulkWriteOperation<IChapter>[] = chapters.map(
      (chapter) => {
        return {
          updateOne: {
            filter: {
              _id: chapter.id,
            },
            update: {
              $set: {
                courseId: chapter.courseId,
                title: chapter.title,
                description: chapter.description,
                sortOrder: chapter.sortOrder,
                objectIndex: chapter.objectIndex,
              },
            },
          },
        };
      },
    );

    await ChapterModel.bulkWrite(operations);
  }

  async getMaxObjectIndex(courseId: string): Promise<number> {
    const max = await ChapterModel.find({ courseId }).countDocuments();
    return max;
  }
}

import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';
import { MongooseChapterMapper } from '@infrastructure/adapter/persistence/mongoose/model/chapter/mapper/MongooseChapterMapper';
import {
  ChapterModel,
  type MongooseChapter,
} from '@infrastructure/adapter/persistence/mongoose/model/chapter/MongooseChapter';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { nanoid } from '@shared/utils/nanoid';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseChapterRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Chapter, MongooseChapter>
  implements ChapterRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(ChapterModel, MongooseChapterMapper, session);
  }

  async findByCourseId(courseId: string): Promise<Chapter[]> {
    const docs = await ChapterModel.find({ courseId }, null, {
      session: this.session,
    }).sort({ objectIndex: 1 });
    return MongooseChapterMapper.toDomainEntities(docs);
  }

  async getMaxObjectIndex(courseId: string): Promise<number> {
    const result = await ChapterModel.findOne({ courseId }, null, {
      session: this.session,
    })
      .sort({ objectIndex: -1 })
      .select('objectIndex');
    return result ? result.objectIndex : 0;
  }

  async deepCloneByCourseId(
    oldCourseId: string,
    newCourseId: string,
  ): Promise<Chapter[]> {
    const originalDocs = await ChapterModel.find(
      { courseId: oldCourseId },
      null,
      { session: this.session },
    );

    const clonedDocs = originalDocs.map((doc) => {
      const cloned = doc.toObject();
      cloned._id = nanoid();
      cloned.courseId = newCourseId;
      return cloned;
    });

    await ChapterModel.insertMany(clonedDocs, { session: this.session });

    return MongooseChapterMapper.toDomainEntities(clonedDocs);
  }

  async updateAll(chapters: Chapter[]): Promise<void> {
    const bulkOps = chapters.map((chapter) => ({
      updateOne: {
        filter: { _id: chapter.id },
        update: MongooseChapterMapper.toMongooseEntity(chapter),
      },
    }));
    await ChapterModel.bulkWrite(bulkOps, { session: this.session });
  }
}

import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { MongooseLectureMapper } from '@infrastructure/adapter/persistence/mongoose/model/lecture/mapper/MongooseLectureMapper';
import {
  LectureModel,
  type MongooseLecture,
} from '@infrastructure/adapter/persistence/mongoose/model/lecture/MongooseLecture';
import { nanoid } from '@shared/utils/nanoid';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseLectureRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Lecture, MongooseLecture>
  implements LectureRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(LectureModel, new MongooseLectureMapper(), session);
  }

  async findByCourseId(courseId: string): Promise<Lecture[]> {
    const docs = await LectureModel.find({ courseId }, null, {
      session: this.session,
    }).sort({ objectIndex: 1 });
    return this.mapper.toDomainEntities(docs);
  }

  async getMaxObjectIndex(courseId: string): Promise<number> {
    const result = await LectureModel.findOne({ courseId }, null, {
      session: this.session,
    })
      .sort({ objectIndex: -1 })
      .select('objectIndex');
    return result ? result.objectIndex : 0;
  }

  async updateAll(lectures: Lecture[]): Promise<void> {
    const bulkOps = lectures.map((lecture) => ({
      updateOne: {
        filter: { _id: lecture.id },
        update: this.mapper.toPersistence(lecture),
      },
    }));
    await LectureModel.bulkWrite(bulkOps, { session: this.session });
  }

  async deepCloneByCourseId(
    oldCourseId: string,
    newCourseId: string,
  ): Promise<Lecture[]> {
    const originalDocs = await LectureModel.find(
      { courseId: oldCourseId },
      null,
      { session: this.session },
    );

    const clonedDocs = originalDocs.map((doc) => {
      const cloned = doc.toObject() as MongooseLecture;
      cloned._id = nanoid();
      cloned.courseId = newCourseId;
      return cloned;
    });

    await LectureModel.insertMany(clonedDocs, { session: this.session });

    return this.mapper.toDomainEntities(clonedDocs);
  }
}

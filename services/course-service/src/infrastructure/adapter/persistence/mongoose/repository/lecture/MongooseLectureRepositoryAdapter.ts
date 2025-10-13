import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';
import { MongooseLectureMapper } from '@infrastructure/adapter/persistence/mongoose/model/lecture/mapper/MongooseLectureMapper';
import {
  LectureModel,
  type MongooseLecture,
} from '@infrastructure/adapter/persistence/mongoose/model/lecture/MongooseLecture';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
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
    super(LectureModel, MongooseLectureMapper, session);
  }

  async findByCourseId(courseId: string): Promise<Lecture[]> {
    const docs = await LectureModel.find({ courseId }, null, {
      session: this.session,
    }).sort({ objectIndex: 1 });
    return MongooseLectureMapper.toDomainEntities(docs);
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
        update: MongooseLectureMapper.toMongooseEntity(lecture),
      },
    }));
    await LectureModel.bulkWrite(bulkOps, { session: this.session });
  }
}

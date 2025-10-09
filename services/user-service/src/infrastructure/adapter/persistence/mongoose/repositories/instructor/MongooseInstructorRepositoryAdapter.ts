import type { Instructor } from '@core/domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorMapper } from '@infrastructure/adapter/persistence/mongoose/models/instructor/mapper/MongooseInstructorMapper';
import {
  InstructorModel,
  type MongooseInstructor,
} from '@infrastructure/adapter/persistence/mongoose/models/instructor/MongooseInstructor';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';

export class MongooseInstructorRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseInstructor, Instructor>
  implements InstructorRepositoryPort
{
  constructor() {
    super(InstructorModel, InstructorMapper);
  }

  async incrementTotalLearners(instructorId: string): Promise<void> {
    await InstructorModel.updateOne(
      { _id: instructorId },
      {
        $inc: {
          totalLearners: 1,
        },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async incrementSessionsConducted(instructorId: string): Promise<void> {
    await InstructorModel.updateOne(
      { _id: instructorId },
      {
        $inc: {
          sessionsConducted: 1,
        },
        $set: { updatedAt: new Date() },
      },
    );
  }
}

import type { Instructor } from '@core/domain/instructor/entity/Instructor';
import { InstructorMapper } from '@infrastructure/adapter/persistence/mongoose/models/instructor/mapper/MongooseInstructorMapper';
import {
  InstructorModel,
  type MongooseInstructor,
} from '@infrastructure/adapter/persistence/mongoose/models/instructor/MongooseInstructor';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';

export class MongooseInstructorRepositoryAdapter extends MongooseBaseRepositoryAdpater<
  MongooseInstructor,
  Instructor
> {
  constructor() {
    super(InstructorModel, InstructorMapper);
  }
}

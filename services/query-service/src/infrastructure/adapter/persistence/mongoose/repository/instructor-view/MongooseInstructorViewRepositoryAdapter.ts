import type {
  InstructorViewRepositoryPort,
  UpsertPayload,
} from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import type { InstructorViewQueryResult } from "@core/application/instructor-view/port/persistence/types/GetInstructorViewQueryResult";
import type { InstructorViewQueryParameters } from "@core/application/instructor-view/port/persistence/types/InstructorViewQueryParameters";
import type { UpdateUserPayload } from "@core/common/port/persistence/types/UpdateUserPayload";
import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";
import { MongooseBaseRepositoryAdpater } from "@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter";
import { MongooseInstructorViewMapper } from "@infrastructure/adapter/persistence/mongoose/model/instructor-view/mapper/MongooseInstructorViewMapper";
import {
  InstructorViewModel,
  type MongooseInstructorView,
} from "@infrastructure/adapter/persistence/mongoose/model/instructor-view/MongooseInstructorView";
import type { FilterQuery } from "mongoose";

export class MongooseInstructorRepositoryViewAdapter
  extends MongooseBaseRepositoryAdpater<MongooseInstructorView, InstructorView>
  implements InstructorViewRepositoryPort
{
  constructor() {
    super(InstructorViewModel, MongooseInstructorViewMapper);
  }

  async upsert(id: string, payload: UpsertPayload): Promise<InstructorView> {
    const document = await InstructorViewModel.findByIdAndUpdate(
      { _id: id },
      { $set: payload },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return MongooseInstructorViewMapper.toDomain(document);
  }

  async findInstructors(
    queryParameters: InstructorViewQueryParameters,
    excludeId?: string,
  ): Promise<InstructorViewQueryResult> {
    const limit = queryParameters.limit || this.defaultLimit;
    const offset = queryParameters.offset || this.defaultOffset;

    const filterQuery: FilterQuery<InstructorView> = {};

    if (excludeId) {
      filterQuery._id = { $ne: excludeId };
    }

    const totalCount = await InstructorViewModel.countDocuments(filterQuery);

    const documents = await InstructorViewModel.find(filterQuery)
      .skip(offset)
      .limit(limit)
      .exec();

    const instructors =
      MongooseInstructorViewMapper.toDomainEntities(documents);

    return {
      instructors,
      totalCount,
    };
  }

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<void> {
    const update: Record<string, any> = {
      "profile.name": payload.name,
      ...(payload.image !== undefined && { "profile.image": payload.image }),
      ...(payload.bio !== undefined && { "profile.bio": payload.bio }),
    };

    await InstructorViewModel.updateOne(
      { _id: userId },
      { $set: update },
    ).exec();
  }
}

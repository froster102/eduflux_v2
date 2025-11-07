import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';
import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { Course } from '@core/domain/course/entity/Course';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';
import { MongooseCourseMapper } from '@infrastructure/adapter/persistence/mongoose/model/course/mapper/MongooseCourseMapper';
import {
  CourseModel,
  type MongooseCourse,
} from '@infrastructure/adapter/persistence/mongoose/model/course/MongooseCourse';
import { DatabaseException } from '@infrastructure/exceptions/DatabaseException';
import { unmanaged } from 'inversify';
import type { ClientSession, FilterQuery } from 'mongoose';

export class MongooseCourseRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Course, MongooseCourse>
  implements CourseRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(CourseModel, new MongooseCourseMapper(), session);
  }

  async findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null> {
    const doc = await CourseModel.findOne(
      {
        _id: courseId,
        'instructor.id': instructorId,
      },
      null,
      { session: this.session },
    );
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findCourseByTitle(title: string): Promise<Course | null> {
    const doc = await CourseModel.findOne({ title }, null, {
      session: this.session,
    });
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findAllInstructorCourses(
    instructorId: string,
    query?: CourseQueryParameters,
  ): Promise<CourseQueryResult> {
    const dbQuery: FilterQuery<MongooseCourse> = {
      'instructor.id': instructorId,
    };

    if (query?.filters?.status) {
      dbQuery.status = query.filters.status;
    }

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await CourseModel.countDocuments(dbQuery);
    const courses = await CourseModel.find(dbQuery).limit(limit).skip(skip);

    return {
      totalCount,
      courses: this.mapper.toDomainEntities(courses),
    };
  }

  async findAllPublishedCourses(
    query?: CourseQueryParameters,
    excludeInstructorId?: string,
  ): Promise<CourseQueryResult> {
    const filterQuery: FilterQuery<MongooseCourse> = {
      status: CourseStatus.PUBLISHED,
    };

    if (excludeInstructorId) {
      filterQuery['instructor.id'] = { $ne: excludeInstructorId };
    }
    const sortQuery: Record<string, 1 | -1> = {};

    if (query?.filters) {
      const { catergory, instructor, level, sort } = query.filters;
      if (catergory) {
        filterQuery.categoryId = catergory;
      }
      if (instructor) {
        filterQuery.$text = { $search: instructor };
      }
      if (level) {
        filterQuery['level'] = level;
      }
      if (sort) {
        for (const [field, order] of Object.entries(sort)) {
          sortQuery[field] = order === SortOrder.ASC ? 1 : -1;
        }
      }
    }

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await CourseModel.countDocuments(filterQuery);
    const courses = await CourseModel.find(filterQuery)
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);

    return {
      totalCount,
      courses: this.mapper.toDomainEntities(courses),
    };
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const doc = await CourseModel.findOne({ slug });
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const doc = await CourseModel.findOne({ slug });
    return !!doc;
  }

  async deepClone(
    originalCourseId: string,
    newCourseId: string,
  ): Promise<Course> {
    const pipeline = [
      { $match: { _id: originalCourseId } },
      { $unset: ['_id', 'createdAt', 'updatedAt'] },
      {
        $addFields: {
          _id: newCourseId,
          originalCourseId: originalCourseId,
          status: CourseStatus.DRAFT_UPDATE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },

      { $merge: { into: CourseModel.collection.name } },
    ];

    await CourseModel.aggregate(pipeline, { session: this.session });

    const newDoc = await CourseModel.findById(newCourseId);

    if (!newDoc) {
      throw new DatabaseException();
    }

    return this.mapper.toDomain(newDoc);
  }

  async swapContent(
    originalCourse: Course,
    shadowCourse: Course,
  ): Promise<void> {
    const originalCourseId = originalCourse.id;
    const shadowCourseId = shadowCourse.id;

    if (!this.session) {
      throw new DatabaseException();
    }

    const shadowDoc = this.mapper.toPersistence(shadowCourse);

    const updatePayload: Partial<MongooseCourse> = {
      title: shadowDoc.title,
      description: shadowDoc.description,
      price: shadowDoc.price,
      thumbnail: shadowDoc.thumbnail,
      updatedAt: new Date(),
      publishedAt: new Date(),
    };

    await CourseModel.updateOne(
      { _id: originalCourseId },
      { $set: updatePayload },
      { session: this.session },
    );

    await this.model.db
      .model('Chapter')
      .updateMany(
        { courseId: shadowCourseId },
        { $set: { courseId: originalCourseId } },
        { session: this.session },
      );

    await this.model.db
      .model('Lecture')
      .updateMany(
        { courseId: shadowCourseId },
        { $set: { courseId: originalCourseId } },
        { session: this.session },
      );

    await CourseModel.deleteOne(
      { _id: shadowCourseId },
      { session: this.session },
    );
  }

  async incrementCourseEnrollmentCount(courseId: string): Promise<void> {
    await CourseModel.findByIdAndUpdate(
      courseId,
      { $inc: { enrollmentCount: 1 }, updatedAt: new Date() },
      { session: this.session },
    );
  }
}

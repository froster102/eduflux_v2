import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { PublishCoursePort } from '@core/application/course/port/usecase/PublishCoursePort';
import type { PublishCourseUseCase } from '@core/application/course/usecase/PublishCourseUseCase';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { CourseEvents } from '@core/common/events/enum/CourseEvents';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { EventBusPort } from '@core/common/port/message/EventBustPort';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { Course } from '@core/domain/course/entity/Course';
import type { CoursePublishedEvent } from '@core/domain/course/events/CoursePublishedEvent';
import { contentLimits } from '@shared/config/content-limits.config';
import { inject } from 'inversify';

const COURSE_MIN_LECTURES_REQUIRED = contentLimits.COURSE_MIN_LECTURES_REQUIRED;

export class PublishCourseService implements PublishCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(AssetDITokens.AssetRepository)
    private readonly assetRepository: AssetRepositoryPort,
    @inject(CourseDITokens.UserServiceGateway)
    private readonly userServiceGateway: UserServiceGatewayPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async execute(payload: PublishCoursePort): Promise<Course> {
    const { courseId, actor } = payload;
    const errors: string[] = [];

    const course = await this.courseRepository.findById(courseId);
    if (!course)
      throw new NotFoundException(`Course with ID:${courseId} not found`);

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to publish this course.',
      );
    }

    const instructorInfo = await this.userServiceGateway.getUser(
      course.instructor.id,
    );

    if (!course.title || course.title.trim() === '') {
      errors.push('Course title is required.');
    }

    if (!course.description || course.description.trim().length < 50) {
      errors.push(
        'Course description is required and must be at least 50 characters.',
      );
    }

    if (!course.categoryId) errors.push('Course category is required.');
    if (!course.level) errors.push('Course level is required.');
    if (!course.thumbnail) errors.push('Course thumbnail is required.');

    if (!course.isFree && (course.price === null || course.price <= 0)) {
      errors.push(
        'Course price must be set and greater than zero for paid courses.',
      );
    }

    if (course.isFree && course.price !== null) {
      errors.push('Free courses cannot have a price set.');
    }

    if (instructorInfo) {
      const bioWordCount = instructorInfo.bio?.trim().split(/\s+/).length || 0;
      if (bioWordCount < 50) {
        errors.push('Instructor bio must contain at least 50 words.');
      }
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);
    if (chapters.length === 0)
      errors.push('Course must contain at least one chapter.');

    const invalidChapters = chapters.filter(
      (c) => !c.title?.trim() || !c.description?.trim(),
    );
    if (invalidChapters.length > 0) {
      errors.push('All chapters must have a non-empty title and description.');
    }

    const lectures = await this.lectureRepository.findByCourseId(courseId);
    if (lectures.length < COURSE_MIN_LECTURES_REQUIRED) {
      errors.push(
        `Course must contain at least ${COURSE_MIN_LECTURES_REQUIRED} lectures.`,
      );
    }

    const invalidLectures = lectures.filter(
      (l) => !l.title?.trim() || !l.description?.trim(),
    );
    if (invalidLectures.length > 0) {
      errors.push('All lectures must have a non-empty title and description.');
    }

    const lectureAssetIds = lectures
      .map((l) => l.assetId)
      .filter((id): id is string => id !== null);
    if (lectureAssetIds.length !== lectures.length) {
      errors.push('All lectures must have an associated media asset.');
    }

    if (lectureAssetIds.length > 0) {
      const assets = await this.assetRepository.findByIds(lectureAssetIds);
      const invalidAssets = assets.filter(
        (a) => a.status !== MediaStatus.UPLOADED,
      );
      if (invalidAssets.length > 0) {
        errors.push(
          'All associated media assets must be successfully uploaded and processed.',
        );
      }
    }

    if (errors.length > 0)
      throw new InvalidInputException(JSON.stringify(errors));

    course.publish();
    await this.courseRepository.update(courseId, course);

    //send event to update the instructor views
    const coursePublishedEvent: CoursePublishedEvent = {
      id: course.id,
      type: CourseEvents.COURSE_PUBLISHED,
      instructorId: course.instructor.id,
      occurredAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    await this.eventBus.sendEvent(coursePublishedEvent);

    return course;
  }
}

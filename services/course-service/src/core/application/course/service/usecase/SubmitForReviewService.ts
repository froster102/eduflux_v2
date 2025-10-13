import { inject } from 'inversify';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import { Course } from '@core/domain/course/entity/Course';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { SubmitCourseForReviewUseCase } from '@core/application/course/usecase/SubmitCourseForReviewUseCase';
import type { SubmitCourseForReviewPort } from '@core/application/course/port/usecase/SubmitForReviewPort';

const MIN_LECTURES_REQUIRED = 5;

export class SubmitCourseForReviewService
  implements SubmitCourseForReviewUseCase
{
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
  ) {}

  async execute(payload: SubmitCourseForReviewPort): Promise<Course> {
    const { courseId, actor } = payload;
    const errors: string[] = [];

    const course = await this.courseRepository.findById(courseId);
    if (!course)
      throw new NotFoundException(`Course with ID:${courseId} not found`);

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to submit this course for review.',
      );
    }

    const instructorInfo = await this.userServiceGateway.getUserDetails(
      course.instructor.id,
    );

    if (course.status === CourseStatus.IN_REVIEW)
      errors.push('Course is already under review.');
    if (['published', 'approved'].includes(course.status)) {
      errors.push(
        'Published or approved courses cannot be submitted directly. Unpublish first if major changes are needed.',
      );
    }

    if (!course.title || course.title.trim() === '')
      errors.push('Course title is required.');
    if (!course.description || course.description.trim().length < 50) {
      errors.push(
        'Course description is required and must be at least 50 characters.',
      );
    }
    if (!course.categoryId) errors.push('Course category is required.');
    if (!course.level) errors.push('Course level is required.');
    if (!course.thumbnail) errors.push('Course thumbnail is required.');
    if (!course.isFree && (!course.price || course.price <= 0))
      errors.push('Paid courses must have a price.');
    if (course.isFree && course.price !== null)
      errors.push('Free courses cannot have a price set.');

    if (instructorInfo) {
      if (!instructorInfo.bio || instructorInfo.bio.trim().length < 50) {
        errors.push(
          'Instructor must complete a bio with at least 50 characters.',
        );
      }
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);
    if (chapters.length === 0)
      errors.push('Course must contain at least one chapter.');
    const incompleteChapters = chapters.filter(
      (c) =>
        !c.title ||
        !c.description ||
        c.title.trim() === '' ||
        c.description.trim() === '',
    );
    if (incompleteChapters.length > 0)
      errors.push('All chapters must have a non-empty title and description.');

    const lectures = await this.lectureRepository.findByCourseId(courseId);
    if (lectures.length < MIN_LECTURES_REQUIRED)
      errors.push(
        `Course must contain at least ${MIN_LECTURES_REQUIRED} lectures.`,
      );
    const incompleteLectures = lectures.filter(
      (l) =>
        !l.title ||
        !l.description ||
        l.title.trim() === '' ||
        l.description.trim() === '',
    );
    if (incompleteLectures.length > 0)
      errors.push('All lectures must have a non-empty title and description.');

    const lectureAssetIds = lectures
      .map((l) => l.assetId)
      .filter((id): id is string => id !== null);
    if (lectureAssetIds.length !== lectures.length)
      errors.push('All lectures must have an associated media asset.');
    if (lectureAssetIds.length > 0) {
      const assets = await this.assetRepository.findByIds(lectureAssetIds);
      const uploadedCount = assets.filter(
        (a) => a.status === MediaStatus.UPLOADED,
      ).length;
      if (uploadedCount !== lectureAssetIds.length)
        errors.push('All media assets must be uploaded and processed.');
    }

    if (errors.length > 0)
      throw new InvalidInputException(JSON.stringify(errors));

    course.submitForReview();
    await this.courseRepository.update(courseId, course);

    return course;
  }
}

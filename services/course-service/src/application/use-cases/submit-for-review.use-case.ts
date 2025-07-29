import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { IUserServiceGateway } from '../ports/user-service.gateway';
import type {
  ISubmitForReviewUseCase,
  SubmitForReviewInput,
} from './interface/submit-for-review.interface';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';

const MIN_LECTURES_REQUIRED = 5;

@injectable()
export class SubmitForReviewUseCase implements ISubmitForReviewUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
  ) {}

  async execute(submitForReviewInput: SubmitForReviewInput): Promise<Course> {
    const { courseId, actor } = submitForReviewInput;
    const errors: string[] = [];

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException('You are not authorized for this action.');
    }

    const instructorInfo = await this.userServiceGateway.getUserDetails(
      foundCourse.instructor.id,
    );

    if (foundCourse.status === 'in_review') {
      errors.push('Course is already under review.');
    }
    if (
      foundCourse.status === 'published' ||
      foundCourse.status === 'approved'
    ) {
      errors.push(
        'Published or approved courses cannot be submitted for review directly. Consider unpublishing first if major changes are needed.',
      );
    }

    if (!foundCourse.title || foundCourse.title.trim() === '') {
      errors.push('Course title is required.');
    }
    if (!foundCourse.description || foundCourse.description.trim() === '') {
      errors.push(
        'Course description is required and must be at least 50 characters long.',
      );
    }
    if (!foundCourse.categoryId) {
      errors.push('Course category is required.');
    }
    if (!foundCourse.level) {
      errors.push('Course level is required.');
    }
    if (!foundCourse.thumbnail) {
      errors.push('Course thumbnail is required.');
    }
    if (
      !foundCourse.isFree &&
      (foundCourse.price === null || foundCourse.price <= 0)
    ) {
      errors.push(
        'Course price must be set and greater than zero for paid courses.',
      );
    }
    if (foundCourse.isFree && foundCourse.price !== null) {
      errors.push('Free courses cannot have a price set.');
    }
    if (
      !instructorInfo.bio ||
      instructorInfo.bio.trim() === '' ||
      instructorInfo.bio.trim().length < 50
    ) {
      errors.push(
        'Instructor should complete their bio with minimum of 50 words',
      );
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);
    if (chapters.length === 0) {
      errors.push('Course must contain at least one chapter.');
    }

    const incompleteChapters = chapters.filter(
      (c) =>
        !c.title ||
        c.title.trim() === '' ||
        !c.description ||
        c.description.trim() === '',
    );
    if (incompleteChapters.length > 0) {
      errors.push('All chapters must have a non-empty title and description.');
    }

    const lectures = await this.lectureRepository.findByCourseId(courseId);
    if (lectures.length < MIN_LECTURES_REQUIRED) {
      errors.push(
        `Course must contain at least ${MIN_LECTURES_REQUIRED} lectures.`,
      );
    }

    const incompleteLectures = lectures.filter(
      (l) =>
        !l.title ||
        l.title.trim() === '' ||
        !l.description ||
        l.description.trim() === '',
    );
    if (incompleteLectures.length > 0) {
      errors.push('All lectures must have a non-empty title and description.');
    }

    const lectureAssetIds = lectures
      .map((lecture) => lecture.assetId)
      .filter((assetId): assetId is string => assetId !== null);

    if (lectures.length > 0 && lectureAssetIds.length !== lectures.length) {
      errors.push('All lectures must have an associated media asset.');
    }

    if (lectureAssetIds.length > 0) {
      const assets = await this.assetRepository.findByIds(lectureAssetIds);
      const uploadedAssetsCount = assets.filter(
        (asset) => asset.status === 'uploaded',
      ).length;

      if (uploadedAssetsCount !== lectureAssetIds.length) {
        errors.push(
          'All associated media assets must be successfully uploaded and processed.',
        );
      }
    }

    if (errors.length > 0) {
      throw new InvalidInputException(JSON.stringify(errors));
    }

    foundCourse.submitForReview();
    await this.courseRepository.update(courseId, foundCourse);

    return foundCourse;
  }
}

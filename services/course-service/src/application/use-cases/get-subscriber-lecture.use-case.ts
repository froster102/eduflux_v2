import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { IEnrollmentServiceGateway } from '../ports/enrollment-service.gateway';
import { LectureDto } from '../dto/lecture.dto';
import { IUseCase } from './interface/use-case.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { UnauthorizedException } from '../exceptions/unauthorised.execption';

export interface GetSubscriberLectureInput {
  userId: string;
  courseId: string;
  lectureId: string;
}

export interface GetSubscriberLectureOutput {
  lecture: LectureDto;
}

export class GetSubscriberLectureUseCase
  implements IUseCase<GetSubscriberLectureInput, GetSubscriberLectureOutput>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.EnrollmentServiceGateway)
    private readonly enrollmentServiceGateway: IEnrollmentServiceGateway,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(
    getSubscriberLectureInput: GetSubscriberLectureInput,
  ): Promise<GetSubscriberLectureOutput> {
    const { courseId, lectureId, userId } = getSubscriberLectureInput;
    const enrollment = await this.enrollmentServiceGateway.checkUserEnrollment(
      userId,
      courseId,
    );

    if (!enrollment.isEnrolled) {
      throw new UnauthorizedException(
        'You are not authroized to view this action.',
      );
    }

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lecture = await this.lectureRepository.findById(lectureId);

    if (!lecture) {
      throw new NotFoundException('Lecture not found.');
    }

    const asset = await this.assetRepository.findById(lecture.assetId!);

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return {
      lecture: {
        _class: lecture.class,
        assetId: lecture.assetId,
        courseId: lecture.courseId,
        description: lecture.description,
        id: lecture.id,
        objectIndex: lecture.objectIndex,
        preview: lecture.preview,
        sortOrder: lecture.sortOrder,
        title: lecture.title,
        asset: {
          _class: asset.class,
          id: asset.id,
          provider: 'cloudinary',
          providerSpecificId: null,
          resourceType: null,
          accessType: 'private',
          originalFileName: null,
          duration: null,
          status: 'processing',
          mediaSources: asset.mediaSources,
          additionalMetadata: null,
        },
      },
    };
  }
}

import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { GetSubscriberLecturePort } from '@core/application/lecture/port/usecase/GetSubscriberLecturePort';
import type { GetSubscriberLectureUseCase } from '@core/application/lecture/usecase/GetSubscriberLectureUseCase';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { GetSubscriberLectureUseCaseResult } from '@core/application/lecture/usecase/types/GetSubscriberLectureUseCaseResult';
import { LectureUseCaseDto } from '@core/application/lecture/usecase/dto/LectureUseCaseDto';
import { AssetUseCaseDto } from '@core/application/asset/usecase/dto/AssetUseCaseDto';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';

export class GetSubscriberLectureService
  implements GetSubscriberLectureUseCase
{
  constructor(
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(AssetDITokens.AssetRepository)
    private readonly assetRepository: AssetRepositoryPort,
  ) {}

  async execute(
    payload: GetSubscriberLecturePort,
  ): Promise<GetSubscriberLectureUseCaseResult> {
    const { lectureId, userId } = payload;

    const lecture = await this.lectureRepository.findById(lectureId);

    if (!lecture) {
      throw new NotFoundException(`Lecture with ID:${lectureId} not found.`);
    }

    let isSubscribed = false;
    const enrollment = await this.enrollmentRepository.findByUserAndCourseId(
      userId,
      lecture.courseId,
    );
    if (enrollment) {
      isSubscribed =
        enrollment.status === EnrollmentStatus.COMPLETED ? true : false;
    }

    if (!isSubscribed && !lecture.preview) {
      throw new ForbiddenException('You are not authorized for this action.');
    }

    const asset = CoreAssert.notEmpty(
      await this.assetRepository.findById(lecture.assetId!),
      new NotFoundException('Asset not found'),
    );

    return {
      ...LectureUseCaseDto.fromEntity(lecture),
      asset: AssetUseCaseDto.fromEntity(asset),
    };
  }
}

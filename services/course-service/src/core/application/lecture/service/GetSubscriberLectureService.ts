import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { EnrollmentServiceGatewayPort } from '@core/application/course/port/gateway/EnrollmentServiceGatewayPort';
import type { GetSubscriberLecturePort } from '@core/application/lecture/port/usecase/GetSubscriberLecturePort';
import type { GetSubscriberLectureUseCase } from '@core/application/lecture/usecase/GetSubscriberLectureUseCase';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { GetSubscriberLectureUseCaseResult } from '@core/application/lecture/usecase/types/GetSubscriberLectureUseCaseResult';
import { LectureUseCaseDto } from '@core/application/lecture/usecase/dto/LectureUseCaseDto';
import { AssetUseCaseDto } from '@core/application/asset/usecase/dto/AssetUseCaseDto';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';

export class GetSubscriberLectureService
  implements GetSubscriberLectureUseCase
{
  constructor(
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(CourseDITokens.EnrollmentServiceGateway)
    private readonly enrollmentServiceGateway: EnrollmentServiceGatewayPort,
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

    const isSubscribed =
      await this.enrollmentServiceGateway.checkUserEnrollment(
        userId,
        lecture.courseId,
      );

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

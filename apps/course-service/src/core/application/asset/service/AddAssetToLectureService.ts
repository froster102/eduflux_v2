import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import type { AddAssetToLecturePort } from '@core/application/asset/port/usecase/AddAssetToLecturePort';
import type { AddAssetToLectureUseCase } from '@core/application/asset/usecase/AddAssetToLectureUseCase';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { FileStorageGatewayPort } from '@core/application/course/port/gateway/FileStorageGatewayPort';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { Asset } from '@core/domain/asset/entity/Asset';
import { AccessType } from '@core/domain/asset/enum/AccessType';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import { StorageProvider } from '@core/domain/asset/enum/StorageProvider';
import { inject } from 'inversify';

export class AddAssetToLectureService implements AddAssetToLectureUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(AssetDITokens.AssetRepository)
    private readonly assetRepository: AssetRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(CourseDITokens.FileStorageGateway)
    private readonly fileStorageGateway: FileStorageGatewayPort,
  ) {}

  async execute(payload: AddAssetToLecturePort): Promise<void> {
    const { courseId, lectureId, key, resourceType, uuid, actor } = payload;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const lecture = await this.lectureRepository.findById(lectureId);

    if (!lecture) {
      throw new NotFoundException(
        `Lecture with ID:${lectureId} not found in the course.`,
      );
    }

    // if (lecture.assetId) {
    //   throw new InvalidInputException(
    //     `Lesson already has a video assigned (mediaId: ${lecture.assetId}). Use the replace video flow if you want to change it.`,
    //   );
    // }

    const data = await this.fileStorageGateway.verifyAssetExists(
      key,
      resourceType,
    );

    if (!data.exists) {
      throw new NotFoundException(`Asset not found.`);
    }

    const asset = Asset.new({
      id: uuid,
      provider: StorageProvider.CLOUDINARY,
      providerSpecificId: key,
      resourceType: resourceType,
      accessType: AccessType.PRIVATE,
      status: MediaStatus.UPLOADED,
      mediaSources: data.mediaSource ? [data.mediaSource] : [],
      originalFileName: data.originalFilename,
      duration: null,
      additionalMetadata: null,
    });

    const createdAsset = await this.assetRepository.save(asset);

    lecture.assignMedia(createdAsset.id);

    await this.lectureRepository.update(lectureId, lecture);

    return;
  }
}

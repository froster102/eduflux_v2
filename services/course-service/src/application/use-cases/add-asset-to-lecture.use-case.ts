import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { IFileStorageGateway } from '../ports/file-storage.gateway';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Asset } from '@/domain/entity/asset.entity';
import type {
  AddAssetToLectureInput,
  IAddAssetToLectureUseCase,
} from './interface/add-asset-to-lecture.interface';

@injectable()
export class AddAssetToLectureUseCase implements IAddAssetToLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
    @inject(TYPES.FileStorageGateway)
    private readonly fileStorageGateway: IFileStorageGateway,
  ) {}

  async execute(addAssetToLectureInput: AddAssetToLectureInput): Promise<void> {
    const { courseId, lectureId, key, resourceType, uuid, actor } =
      addAssetToLectureInput;

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

    const asset = Asset.create(
      uuid,
      'cloudinary',
      key,
      'public',
      data.mediaSource ? [data.mediaSource] : [],
      'uploaded',
      data.originalFilename,
      data.resourceType,
    );

    const createdAsset = await this.assetRepository.save(asset);

    lecture.assignMedia(createdAsset.id);

    await this.lectureRepository.update(lectureId, lecture);

    return;
  }
}

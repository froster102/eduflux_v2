import { inject, injectable } from 'inversify';
import type {
  IFileStorageGateway,
  IUploadCredentialsResponse,
} from '../ports/file-storage.gateway';
import { TYPES } from '@/shared/di/types';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Asset, ResourceType } from '@/domain/entity/asset.entity';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import { v4 as uuidV4 } from 'uuid';
import { IUseCase } from './interface/use-case.interface';

export interface GetCourseAssetsUploadUrlDto {
  courseId: string;
  resourceType: ResourceType;
}
export interface GetCourseAssetsUploadUrlInput {
  getCourseAssetsUploadUrlDto: GetCourseAssetsUploadUrlDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class GetCourseAssetsUploadUrlUseCase
  implements IUseCase<GetCourseAssetsUploadUrlInput, IUploadCredentialsResponse>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.FileStorageGateway)
    private readonly fileStorageGateway: IFileStorageGateway,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(
    getCourseAssetsUploadUrlInput: GetCourseAssetsUploadUrlInput,
  ): Promise<IUploadCredentialsResponse> {
    const { getCourseAssetsUploadUrlDto: dto, actor } =
      getCourseAssetsUploadUrlInput;
    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found.`);
    }

    if (actor.id !== course.instructor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const folderPath = `courses/${course.id}/assets`;

    const assetId = uuidV4();

    const providerSpecificId = folderPath + '/' + assetId;

    const asset = Asset.create(
      assetId,
      'cloudinary',
      providerSpecificId,
      'private',
    );

    await this.assetRepository.save(asset);

    const response = this.fileStorageGateway.getUploadCredentials({
      accessType: 'private',
      folderPath: folderPath,
      assetId,
      providerSpecificId,
      resourceType: dto.resourceType,
    });

    return response;
  }
}

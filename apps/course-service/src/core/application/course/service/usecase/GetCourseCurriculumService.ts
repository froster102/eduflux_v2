import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AssetRepositoryPort } from '@core/application/asset/port/persistence/AssetRepositoryPort';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { GetCourseCurriculumPort } from '@core/application/course/port/usecase/GetCourseCurriculumPort';
import type { CurriculumItemWithAsset } from '@core/application/course/usecase/dto/CurriculumItemWithAsset';
import type { GetCourseCurriculumUseCase } from '@core/application/course/usecase/GetCourseCurriculumUseCase';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import type { Asset } from '@core/domain/asset/entity/Asset';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';
import { inject } from 'inversify';

export class GetCourseCurriculumService implements GetCourseCurriculumUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(AssetDITokens.AssetRepository)
    private readonly assetRepository: AssetRepositoryPort,
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(
    payload: GetCourseCurriculumPort,
  ): Promise<CurriculumItemWithAsset[]> {
    const { id, executor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(id),
      new NotFoundException(`Course with ID:${id} not found.`),
    );

    if (course.status !== CourseStatus.PUBLISHED && !executor) {
      throw new ForbiddenException(
        'You are not authorized to view this course.',
      );
    }

    const isInstructor = executor && executor.id === course.instructor.id;
    const isAdmin = executor && executor.hasRole(Role.ADMIN);

    let isEnrolled = false;
    if (executor) {
      const enrollment = await this.enrollmentRepository.findByUserAndCourseId(
        executor.id,
        course.id,
      );
      isEnrolled =
        !!enrollment && enrollment.status === EnrollmentStatus.COMPLETED;
    }

    const canViewAllAssets = Boolean(isInstructor || isAdmin);
    const canViewPreviewsOnly = Boolean(
      !canViewAllAssets && (executor || isEnrolled),
    );

    return this.buildCourseCurriculum(
      id,
      canViewAllAssets,
      canViewPreviewsOnly,
    );
  }

  private async buildCourseCurriculum(
    id: string,
    canViewAllAssets: boolean,
    canViewPreviewsOnly: boolean,
  ): Promise<CurriculumItemWithAsset[]> {
    const chapters = await this.chapterRepository.findByCourseId(id);
    const lectures = await this.lectureRepository.findByCourseId(id);

    const assetIdsToFetch = lectures
      .filter((lecture) => lecture.assetId)
      .map((lecture) => lecture.assetId!);

    const assetMap = new Map<string, Asset>();

    if (assetIdsToFetch.length > 0) {
      const fetchedAssets =
        await this.assetRepository.findByIds(assetIdsToFetch);
      fetchedAssets.forEach((asset) => assetMap.set(asset.id, asset));
    }

    const curriculumItems: CurriculumItemWithAsset[] = [
      ...ChapterUseCaseDto.fromEntities(chapters),
    ];

    for (const lecture of lectures) {
      const lectureWithAsset: Lecture & { asset?: Partial<Asset> } = {
        ...lecture.toJSON(),
      } as unknown as Lecture;

      const asset = lecture.assetId ? assetMap.get(lecture.assetId) : null;

      if (asset) {
        const includeAsset =
          canViewAllAssets || (canViewPreviewsOnly && lecture.preview);
        if (includeAsset) {
          lectureWithAsset.asset = {
            id: asset.id,
            provider: asset.provider,
            providerSpecificId: asset.providerSpecificId,
            resourceType: asset.resourceType,
            accessType: asset.accessType,
            originalFileName: asset.originalFileName,
            duration: asset.duration,
            status: asset.status,
            mediaSources: includeAsset ? asset.mediaSources : [],
          };
        }
      }

      curriculumItems.push(lectureWithAsset);
    }

    curriculumItems.sort((a, b) => a.sortOrder - b.sortOrder);
    return curriculumItems;
  }
}

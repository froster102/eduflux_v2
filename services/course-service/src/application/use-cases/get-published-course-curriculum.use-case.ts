import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  IGetPublishedCourseCurriculumUseCase,
  CurriculumItemWithAsset,
} from './interface/get-published-course-curriculum.interface';
import { Lecture } from '@/domain/entity/lecture.entity';
import { Asset } from '@/domain/entity/asset.entity';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import {} from './interface/get-instructor-course-curriculum.interface';

export class GetPublishedCourseCurriculumUseCase
  implements IGetPublishedCourseCurriculumUseCase
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(courseId: string): Promise<CurriculumItemWithAsset[]> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);
    const lectures = await this.lectureRepository.findByCourseId(courseId);

    const assetIdsToFetch = lectures
      .map((lecture) => {
        if (lecture.preview) {
          return lecture.assetId;
        }
      })
      .filter((assetId): assetId is string => assetId !== null);

    const assetMap = new Map<string, Asset>();

    if (assetIdsToFetch.length > 0) {
      const fetchedAssets =
        await this.assetRepository.findByIds(assetIdsToFetch);
      fetchedAssets.forEach((asset) => assetMap.set(asset.id, asset));
    }

    const curriculunItems: CurriculumItemWithAsset[] = [...chapters];

    lectures.forEach((lecture) => {
      const lectureWithAsset: Lecture & { asset?: Partial<Asset> } = {
        ...lecture.toJSON(),
      } as Lecture;

      if (lecture.assetId && assetMap.has(lecture.assetId)) {
        const asset = assetMap.get(lecture.assetId);
        lectureWithAsset.asset = {
          id: asset!.id,
          provider: asset!.provider,
          providerSpecificId: asset!.providerSpecificId,
          resourceType: asset!.resourceType,
          accessType: asset!.accessType,
          originalFileName: asset!.originalFileName,
          duration: asset!.duration,
          status: asset!.status,
          mediaSources: asset!.mediaSources,
        };
      }
      curriculunItems.push(lectureWithAsset);
    });

    curriculunItems.sort((a, b) => a.sortOrder - b.sortOrder);

    return curriculunItems;
  }
}

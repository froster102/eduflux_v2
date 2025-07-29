import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type {
  CurriculumItemWithAsset,
  GetInstructorCourseCurriculumInput,
  IGetInstructorCourseCurriculumUseCase,
} from './interface/get-instructor-course-curriculum.interface';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Lecture } from '@/domain/entity/lecture.entity';
import { Asset } from '@/domain/entity/asset.entity';

@injectable()
export class GetInstructorCourseCurriculumUseCase
  implements IGetInstructorCourseCurriculumUseCase
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

  async execute(
    getInstructorCourseCurriculumInput: GetInstructorCourseCurriculumInput,
  ): Promise<CurriculumItemWithAsset[]> {
    const { id, actor } = getInstructorCourseCurriculumInput;
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID:${id} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to view this course.',
      );
    }

    const chapters = await this.chapterRepository.findByCourseId(id);
    const lectures = await this.lectureRepository.findByCourseId(id);

    const assetIdsToFetch = lectures
      .map((lecture) => lecture.assetId)
      .filter((assetId): assetId is string => assetId !== null);

    const assetMap = new Map<string, Asset>();

    if (assetIdsToFetch.length > 0) {
      const fetchedAssets =
        await this.assetRepository.findByIds(assetIdsToFetch);
      fetchedAssets.forEach((asset) => assetMap.set(asset.id, asset));
    }

    const curriculumItems: CurriculumItemWithAsset[] = [...chapters];

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
      curriculumItems.push(lectureWithAsset);
    });

    curriculumItems.sort((a, b) => a.sortOrder - b.sortOrder);

    return curriculumItems;
  }
}

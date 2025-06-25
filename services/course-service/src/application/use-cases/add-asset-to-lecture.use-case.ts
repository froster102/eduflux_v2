import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IAssetRepository } from '@/domain/repositories/asset.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { IUseCase } from './interface/use-case.interface';

export interface AddAssetToLectureDto {
  courseId: string;
  lectureId: string;
  assetId: string;
}

export interface AddAssetToLectureInput {
  addAssetToLectureDto: AddAssetToLectureDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class AddAssetToLectureUseCase
  implements IUseCase<AddAssetToLectureInput, void>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.AssetRepository)
    private readonly assetRepository: IAssetRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(addAssetToLectureInput: AddAssetToLectureInput): Promise<void> {
    const { addAssetToLectureDto, actor } = addAssetToLectureInput;

    const { assetId, courseId, lectureId } = addAssetToLectureDto;

    const course = await this.courseRepository.findById(courseId);

    const asset = await this.assetRepository.findById(assetId);

    if (!asset) {
      throw new NotFoundException(`Asset with ID:${assetId} not found.`);
    }

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

    if (lecture.assetId) {
      throw new InvalidInputException(
        `Lesson already has a video assigned (mediaId: ${lecture.assetId}). Use the replace video flow if you want to change it.`,
      );
    }

    lecture.assignMedia(assetId);

    await this.lectureRepository.update(lectureId, lecture);

    return;
  }
}

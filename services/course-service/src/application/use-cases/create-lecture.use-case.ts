import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { Lecture } from '@/domain/entity/lecture.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface CreateLectureDto {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
}

export interface CreateLectureInput {
  createLectureDto: CreateLectureDto;
  actor: AuthenticatedUserDto;
}

export class CreateLectureUseCase
  implements IUseCase<CreateLectureInput, Lecture>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(createLectureInput: CreateLectureInput): Promise<Lecture> {
    const { createLectureDto: dto, actor } = createLectureInput;

    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const lecture = Lecture.create(
      dto.courseId,
      dto.title,
      dto.description,
      dto.preview,
      0,
      0,
    );

    const savedLecture = await this.lectureRepository.save(lecture);

    return savedLecture;
  }
}

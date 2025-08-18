import type { LectureDto } from '@/application/dto/lecture.dto';
import type { IUseCase } from './use-case.interface';

export interface GetSubscriberLectureInput {
  userId: string;
  courseId: string;
  lectureId: string;
}

export interface GetSubscriberLectureOutput {
  lecture: LectureDto;
}

export interface IGetSubscriberLectureUseCase
  extends IUseCase<GetSubscriberLectureInput, GetSubscriberLectureOutput> {}

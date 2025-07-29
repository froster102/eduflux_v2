import { IUseCase } from './use-case.interface';

export interface AddLectureProgressInput {
  userId: string;
  lectureId: string;
  courseId: string;
}

export interface IAddLectureProgressUseCase
  extends IUseCase<AddLectureProgressInput, void> {}

import { IUseCase } from './use-case.interface';

export interface DeleteLectureProgressInput {
  userId: string;
  courseId: string;
  lectureId: string;
}

export interface IDeleteLectureProgressUseCase
  extends IUseCase<DeleteLectureProgressInput, void> {}

import { IUseCase } from './use-case.interface';

export interface GetUserCourseProgessInput {
  courseId: string;
  userId: string;
}

export interface GetUserCourseProgressOutput {
  id: string;
  completedLectures: string[];
}

export interface IGetUserCourseProgressUseCase
  extends IUseCase<GetUserCourseProgessInput, GetUserCourseProgressOutput> {}

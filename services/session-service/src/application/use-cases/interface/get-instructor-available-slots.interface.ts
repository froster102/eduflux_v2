import { IUseCase } from './use-case.interface';

export interface GetInstructorAvailableSlotsInput {
  instructorId: string;
  date: string;
  timeZone: string;
}

export interface GetInstructorAvailableSlotsOutput {
  id: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
}

export interface IGetInstructorAvailableSlotsUseCase
  extends IUseCase<
    GetInstructorAvailableSlotsInput,
    GetInstructorAvailableSlotsOutput[]
  > {}

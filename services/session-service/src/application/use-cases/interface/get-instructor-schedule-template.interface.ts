import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { ScheduleSettingDto } from '@/application/dto/scheduleSetting.dto';

export interface GetInstructorScheduleTemplateInput {
  actor: AuthenticatedUserDto;
}

export interface GetInstructorScheduleTemplateOutput {
  setting: ScheduleSettingDto | null;
}

export interface IGetInstructorScheduleTemplateUseCase
  extends IUseCase<
    GetInstructorScheduleTemplateInput,
    GetInstructorScheduleTemplateOutput
  > {}

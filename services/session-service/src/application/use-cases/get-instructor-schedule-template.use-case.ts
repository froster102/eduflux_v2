import type { IScheduleSettingRepository } from '@/domain/repositories/schedule-setting.repository';
import type {
  GetInstructorScheduleTemplateInput,
  GetInstructorScheduleTemplateOutput,
  IGetInstructorScheduleTemplateUseCase,
} from './interface/get-instructor-schedule-template.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { Role } from '@/shared/constants/role';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export class GetInstructorScheduleTemplateUseCase
  implements IGetInstructorScheduleTemplateUseCase
{
  constructor(
    @inject(TYPES.ScheduleSettingRepository)
    private readonly scheduleSettingRepository: IScheduleSettingRepository,
  ) {}

  async execute(
    getInstructorScheduleTemplateInput: GetInstructorScheduleTemplateInput,
  ): Promise<GetInstructorScheduleTemplateOutput> {
    const { actor } = getInstructorScheduleTemplateInput;

    if (!actor.hasRole(Role.INSTRUCTOR)) {
      throw new ForbiddenException(`User with ${actor.id} not authorized`);
    }

    const scheduleSetting = await this.scheduleSettingRepository.findByUserId(
      actor.id,
    );

    if (scheduleSetting) {
      return {
        setting: {
          applyForWeeks: scheduleSetting.applyForWeeks,
          weeklySchedule: scheduleSetting.weeklyAvailabilityTemplate,
          slotDurationMinutes: scheduleSetting.slotDurationMinutes,
          timeZone: scheduleSetting.timeZone,
          createdAt: scheduleSetting.createdAt,
          updatedAt: scheduleSetting.updatedAt,
        },
      };
    }

    return {
      setting: null,
    };
  }
}

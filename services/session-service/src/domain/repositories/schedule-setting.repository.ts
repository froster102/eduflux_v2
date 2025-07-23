import { ScheduleSetting } from '../entities/schedule-setting.entity';
import { IBaseRepository } from './base.repository';

export interface IScheduleSettingRepository
  extends IBaseRepository<ScheduleSetting> {
  findByUserId(userId: string): Promise<ScheduleSetting | null>;
}

import { model } from 'mongoose';
import {
  IMongoScheduleSetting,
  ScheduleSettingSchema,
} from '../schema/schedule-setting.schema';

export const ScheduleSettingModel = model<IMongoScheduleSetting>(
  'ScheduleSetting',
  ScheduleSettingSchema,
);

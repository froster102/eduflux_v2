import { model } from 'mongoose';
import {
  type IMongoScheduleSetting,
  ScheduleSettingSchema,
} from '../schema/session-settings.schema';

export const ScheduleSettingModel = model<IMongoScheduleSetting>(
  'SessionSettings',
  ScheduleSettingSchema,
);

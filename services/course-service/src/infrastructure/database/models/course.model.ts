import mongoose, { Model } from 'mongoose';
import { CourseSchema, ICourse } from '../schema/course.schema';

const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
  'Course',
  CourseSchema,
);

export default CourseModel;
